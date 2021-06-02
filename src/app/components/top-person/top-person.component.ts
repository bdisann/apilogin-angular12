import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { WsService } from 'src/app/services/ws.service';
import { InfoService } from 'src/app/services/info.service';
import INFO_INTERFACE from 'src/app/models/infoInterface';
declare const Ogma: any;

@Component({
  selector: 'app-top-person',
  templateUrl: './top-person.component.html',
  styleUrls: ['./top-person.component.scss'],
})
export class TopPersonComponent implements OnInit, OnDestroy, OnChanges {
  // graph inilialization
  ogma: any;
  ontology: any[] = [];
  nodesArray: any[] = [];
  nodesLength: number;
  edgesArray: any[] = [];
  edgesLength: number;
  type: string;
  name: string;
  population: string;
  currency: string;
  clientX: any;
  clientY: any;
  search: string;
  nameUrl: string;
  usernames: string[] = [];
  isCountry: boolean;
  nodesFilter: any = null;
  edgesFilter: any = null;
  isNotHashtag: boolean;
  // info Popup
  popUp: boolean = false;
  contentInfo: any[] = [];
  timeInfo: string;
  getInfo: any;
  sortLikes: boolean = false;
  sortShares: boolean = false;
  sortEngagements: boolean = false;
  sortComments: boolean = false;
  likes = 'likes';
  comments = 'comments';
  shares = 'shares';
  engagements = 'engagements';
  messageApi: INFO_INTERFACE;
  coordinate = {
    x: 0,
    y: 0,
  };
  @Input() zoom;
  private socketMessage: Object = {
    message: 'graph',
    access_token:
      '86120884ae4b272458ab430724f32da238a6256c7f5b772b0989f885a9e483dc',
    workspace: 'topic-overall',
    delay: '1',
    size: '100',
  };
  private fetchSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private wsocket: WsService,
    private info: InfoService
  ) {}

  ngOnInit() {
    this.graphInit();
    this.isNotHashtag = true;
    // this.getOntology(); // for dummy data
    this.wsocket.setDataGraph(this.socketMessage);
    this.wsocket.getDataGraph().subscribe((res) => {
      if (res['status'] === 'graph') {
        if (!!(res['nodes'].length > 0 && res['edges'].length > 0)) {
          this.ontology = this.ontology.concat(res['nodes']);
          this.nodesArray = this.nodesArray.concat(res['nodes']);
          this.edgesArray = this.edgesArray.concat(res['edges']);
          this.nodesLength = this.nodesArray.map((e) => e.data.username).length;
          this.edgesLength = this.edgesArray.map(
            (e) => e.data.edges_kind
          ).length;
          this.renderOntology(res);
        }
      } else if (res['status'] === 'list_id') {
        this.usernames = this.usernames.concat(res['list_id']);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.contentInfo && changes.contentInfo.currentValue) {
      console.log(this.contentInfo);
    }
  }

  getOntology() {
    this.ogma.clearGraph();
    this.fetchSubscription = this.http
      .get('/assets/json/top-person.json')
      .pipe(map((res) => res['data']))
      .subscribe((res) => {
        if (res['nodes'].length > 0 && res['edges'].length > 0) {
          this.ontology = this.ontology.concat(res);
          console.log(res);
          this.usernames = this.usernames.concat(res['nodes']['data']);
          this.renderOntology(res);
        } else {
          this.ontology = null;
        }
      });
  }

  graphInit() {
    this.ogma = new Ogma({
      container: document.getElementById('container-ogma'),
      renderer: 'canvas',
      options: {
        fpsLimit: 100,
        edgesAlwaysCurvy: true,
        directedEdges: true,
        backgroundColor: 'black',
        gravity: 1,
        texts: {
          preventOverlap: false,
        },
      },
    });

    this.ogma.events.onClick((e) => {
      if (!e.target) return;
      const data = e.target;
      if (!!data.isNode) {
        this.popUp = true;
      } else {
        return;
      }
      this.contentInfo = null;
      this.clientX = e.domEvent.clientX;
      this.clientY = e.domEvent.clientY;
      this.type = data.getData('type');
      this.name = data.getData('username');
      this.nameUrl = this.name
        .split('')
        .filter((e) => e !== '@')
        .join('');

      console.log(this.nameUrl);
      this.messageApi = {
        acces_token:
          '86120884ae4b272458ab430724f32da238a6256c7f5b772b0989f885a9e483dc',
        query: this.nameUrl,
        platform: 'twitter',
        size: 10,
        analisis: 'topic-overall',
        sortBy: 'likes_count',
        order: 'desc',
        page: 1,
      };
      // console.log(message);
      this.getInfo = this.info
        .getNodePostByName(this.messageApi)
        .subscribe((res) => {
          this.timeInfo = new Date(res.timestamp).toString();
          this.contentInfo = [...res.data.content];
        });
    });

    // this.ogma.events.onNodesSelected((event) => {
    //   console.log(event['nodes'].getData('name')[0]);
    // });

    this.ogma.events.onHover((event) => {
      if (!event.target) return;
      if (!event.target.isNode) return;
      this.ogma.styles.setHoveredNodeAttributes({
        outline: true,
        outerStroke: {
          color: 'transparent',
          width: 0,
        },
        text: {
          backgroundColor: 'transparent',
          minVisibleSize: 0,
          color: 'yellow',
          scale: 2,
          scaling: true,
        },
      });
    });
  }

  renderOntology(source: any) {
    // this.ogma.addNodes(source['nodes']);
    // this.ogma.addEdges(source['edges']);

    this.ogma.addGraph(source);
    this.ogma.layouts.forceLink({
      gravity: 1,
      duration: 1200,
      scalingRatio: 100,
    });
  }

  handleZoomOut() {
    if (this.zoom > 4) {
      this.zoom += 1;
      this.ogma.view.zoomOut({ duration: 200 });
    }
    {
      this.zoom = 1;
      this.ogma.view.zoomOut({ duration: 200 });
    }
  }

  handleZoomIn() {
    if (this.zoom > 4) {
      this.zoom += 1;
      this.ogma.view.zoomIn({ duration: 200 });
    }
    {
      this.zoom = 1;
      this.ogma.view.zoomIn({ duration: 200 });
    }
  }

  handleZoomChange() {
    this.ogma.view.setZoom(this.zoom, { duration: 200, easing: 'linear' });
  }

  handleRotateLeft() {
    this.ogma.view.rotate(1.5, { easing: 'linear', duration: 1000 });
  }

  handleRotateRight() {
    this.ogma.view.rotate(-1.5, { easing: 'linear', duration: 1000 });
  }

  handleSearch(e) {
    e.preventDefault();
    let dataExist: any;
    const checkDataExist = this.ontology.find(
      (res) => res.data.username === this.search
    );
    if (!checkDataExist) {
      return;
    }

    dataExist = this.ontology.filter(
      (res) => res.data.username === this.search
    )[0];

    this.ogma.view.setCenter(
      {
        x: dataExist['attributes']['x'],
        y: dataExist['attributes']['y'],
      },
      { duration: 1000 }
    );
    const getNode = this.ogma.getNode(dataExist['id']);

    getNode.pulse({
      duration: 5000,
      interval: 1,
      startColor: 'green',
      endColor: 'red',
      startRatio: 1,
      endRatio: 6,
      width: 10,
    });

    this.ogma.view.setZoom(3);
  }

  handleResetFilter(e) {
    e.preventDefault();
    if (!!this.nodesFilter && !!this.edgesFilter) {
      this.nodesFilter.destroy();
      this.edgesFilter.destroy();
      this.nodesFilter = null;
      this.edgesFilter = null;
    }

    this.isNotHashtag = true;

    this.nodesLength = this.nodesArray.map((e) => e['username']).length;
    this.edgesLength = this.edgesArray.map((e) => e['edges_kind']).length;
  }

  // handle for search Username
  handleFilterUser(e) {
    e.preventDefault();

    if (this.nodesFilter && this.edgesFilter) {
      this.nodesFilter.destroy();
      this.edgesFilter.destroy();
      this.nodesFilter = null;
      this.edgesFilter = null;
    }

    this.isNotHashtag = true;
    const dataNodesExist = this.nodesArray.filter(
      (val) => val.data.username[0] === '@'
    );
    const dataEdgesExist = this.edgesArray.filter(
      (val) => val.data.edges_kind !== 'Hashtag'
    );
    this.nodesLength = dataNodesExist.length;

    this.edgesLength = dataEdgesExist.length;

    this.nodesFilter = this.ogma.transformations.addNodeFilter(
      (node) => {
        return node.getData('username')[0] === '@';
      },
      { duration: 1000 }
    );

    this.edgesFilter = this.ogma.transformations.addEdgeFilter(
      (edge) => edge.getData('edges_kind') !== 'Hashtag',
      { duration: 1000 }
    );
  }

  // handle for search Hashtag
  handleFilterHastagh(e) {
    e.preventDefault();

    if (this.nodesFilter && this.edgesFilter) {
      this.nodesFilter.destroy();
      this.edgesFilter.destroy();
      this.nodesFilter = null;
      this.edgesFilter = null;
    }
    this.isNotHashtag = false;
    const dataNodesExist = this.nodesArray.filter(
      (val) => val.data.username[0] === '#'
    );

    const dataEdgesExist = this.edgesArray.filter(
      (val) => val.data.edges_kind === 'Hashtag'
    );

    this.nodesLength = dataNodesExist.length;
    this.edgesLength = dataEdgesExist.length;

    this.nodesFilter = this.ogma.transformations.addNodeFilter((node) => {
      return node.getData('username')[0] === '#';
    });

    this.edgesFilter = this.ogma.transformations.addEdgeFilter(
      (edge) => edge.getData('edges_kind') === 'Hashtag'
    );
  }

  handleArrow(arrow) {
    switch (arrow) {
      case 'top':
        this.coordinate = { ...this.coordinate, y: this.coordinate.y - 200 };
        this.ogma.view.setCenter(this.coordinate, { duration: 1000 });
        break;
      case 'left':
        this.coordinate = { ...this.coordinate, x: this.coordinate.x - 200 };
        this.ogma.view.setCenter(this.coordinate, { duration: 1000 });
        break;
      case 'right':
        this.coordinate = { ...this.coordinate, x: this.coordinate.x + 200 };
        this.ogma.view.setCenter(this.coordinate, { duration: 1000 });
        break;
      case 'bottom':
        this.coordinate = { ...this.coordinate, y: this.coordinate.y + 200 };
        this.ogma.view.setCenter(this.coordinate, { duration: 1000 });
        break;
      case 'center':
        this.coordinate = { ...this.coordinate, y: 0, x: 0 };
        this.ogma.view.setCenter(this.coordinate, { duration: 1000 });
        break;
      default:
        break;
    }
  }

  sortPost(e, status) {
    e.preventDefault();
    this.contentInfo = null;
    switch (status) {
      case 'likes':
        this.messageApi = {
          ...this.messageApi,
          sortBy: 'likes_count',
          order: this.messageApi.order === 'desc' ? 'asc' : 'desc',
        };
        this.getInfo = this.info
          .getNodePostByName(this.messageApi)
          .subscribe((res) => {
            this.timeInfo = new Date(res.timestamp).toString();
            this.contentInfo = [...res.data.content];
          });
        break;
      case 'shares':
        this.messageApi = {
          ...this.messageApi,
          sortBy: 'shares_count',
          order: this.messageApi.order === 'desc' ? 'asc' : 'desc',
        };
        this.getInfo = this.info
          .getNodePostByName(this.messageApi)
          .subscribe((res) => {
            this.timeInfo = new Date(res.timestamp).toString();
            this.contentInfo = [...res.data.content];
          });
        break;
      default:
        break;
    }
  }

  detailToogle() {
    return (this.popUp = !this.popUp);
  }

  ngOnDestroy() {
    if (this.fetchSubscription) this.fetchSubscription.unsubscribe();
    if (!!this.ogma) this.ogma.clearGraph();
    if (!!this.getInfo) this.getInfo.unsubscribe();
    if (!!this.wsocket) this.wsocket.stopWebSocket();
  }
}

/**
 * Tests image load.
 * @param {String} url
 * @returns {Promise}
 */
function testImageUrl(url) {
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.addEventListener('load', resolve);
    image.addEventListener('error', reject);
    image.src = url;
  });
}
