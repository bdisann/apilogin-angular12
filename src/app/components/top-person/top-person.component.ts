import { Component, OnInit, OnDestroy, DoCheck, Input } from '@angular/core';
import { Subscription, interval, concat } from 'rxjs';
import { map, reduce } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { WsService } from 'src/app/services/ws.service';
declare const Ogma: any;

@Component({
  selector: 'app-top-person',
  templateUrl: './top-person.component.html',
  styleUrls: ['./top-person.component.scss'],
})
export class TopPersonComponent implements OnInit, OnDestroy {
  public ogma: any;
  public ontology: any[] = [];
  type: string;
  name: string;
  population: string;
  currency: string;
  popUp: boolean = false;
  clientX: any;
  clientY: any;
  search: string;
  nameUrl: string;
  usernames: string[] = [];
  isCountry: boolean;
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

  constructor(private http: HttpClient, private wsocket: WsService) {}

  ngOnInit() {
    this.graphInit();
    // this.getOntology(); // for dummy data
    this.wsocket.setDataGraph(this.socketMessage);
    this.wsocket.getDataGraph().subscribe((res) => {
      if (res['status'] === 'graph') {
        if (!!(res['nodes'].length > 0 && res['edges'].length > 0)) {
          this.ontology = this.ontology.concat(res['nodes']);
          this.renderOntology(res);
        }
      } else if (res['status'] === 'list_id') {
        this.usernames = this.usernames.concat(res['list_id']);
      }
    });
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
          textWatermark: {
            fontColor: 'white',
            fontSize: 48,
          },
        },
      },
    });

    this.ogma.events.onClick((e) => {
      if (!e.target) return;
      const data = e.target;
      if (data.isNode) {
        this.popUp = true;
      } else {
        return;
      }
      this.clientX = e.domEvent.clientX;
      this.clientY = e.domEvent.clientY;
      this.type = data.getData('type');
      this.name = data.getData('username');
      this.nameUrl = this.name
        .split('')
        .filter((e) => e !== '@')
        .join('');
      // if (this.type === 'country') {
      //   this.isCountry = true;
      //   this.population = data.getData('population');
      //   this.currency = data.getData('currency');
      // } else {
      //   this.isCountry = false;
      //   this.population = '';
      //   this.currency = '';
      // }
    });

    // this.ogma.events.onNodesSelected((event) => {
    //   console.log(event['nodes'].getData('name')[0]);
    // });

    this.ogma.events.onHover((event) => {
      if (!event.target) return;
      if (!event.target.isNode) return;
      // console.log(event.target.getData('name'));
      this.ogma.styles.setHoveredNodeAttributes({
        outline: true,
        outerStroke: {
          color: 'transparent',
          width: 0,
        },
        text: {
          backgroundColor: 'transparent',
          minVisibleSize: 0,
          color: 'red',
          scale: 3,
          // fpsLimit: 100,
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
      scalingRatio: 1000,
    });

    this.ogma.styles.addRule({
      nodeAttributes: {
        // text: (node) => node.getAttributes()['text'],
        text: {
          content: (node) => node.getData('name'),
          color: (node) =>
            node.getData('type') === 'country' ? 'yellow' : 'white',
          scaling: true,
          scale: 1.5,
          minVisibleSize: 0,
          backgroundColor: 'transparent',
        },
      },
    });
  }

  handleZoomOut() {
    if (this.zoom > 4) {
      this.zoom += 1;
      this.ogma.view.zoomOut({ duration: 200 });
      console.log(this.zoom);
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
      console.log(this.zoom);
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
    if (checkDataExist) {
      dataExist = this.ontology.filter(
        (res) => res.data.username === this.search
      )[0];
    }
    this.ogma.view.setCenter(
      {
        x: dataExist['attributes']['x'],
        y: dataExist['attributes']['y'],
      },
      { duration: 1000 }
    );
    // console.log(dataExist);
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

    this.ogma.view.setZoom(5);
  }

  detailToogle() {
    return (this.popUp = !this.popUp);
  }

  ngOnDestroy() {
    if (this.fetchSubscription) this.fetchSubscription.unsubscribe();
    this.ogma.clearGraph();
    this.wsocket.stopWebSocket();
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
