import { Input, Component, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

declare const Ogma: any;

@Component({
  selector: 'app-top-person',
  templateUrl: './top-person.component.html',
  styleUrls: ['./top-person.component.scss'],
})
export class TopPersonComponent implements OnInit, OnDestroy, OnChanges {
  public ogma: any;
  @Input() public ontology: any;

  private fetchSubscription: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.graphInit();
    this.getOntology();
  }

  ngOnChanges(): void {}

  getOntology() {
    this.ogma.clearGraph();
    this.fetchSubscription = this.http
      .get('/assets/json/top-person.json')
      .pipe(map((res) => res['data']))
      .subscribe((res) => {
        if (res['nodes'].length > 0 && res['edges'].length > 0) {
          this.ontology = res;
          this.renderOntology(this.ontology);
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
        edgesAlwaysCurvy: false,
        directedEdges: false,
        backgroundColor: 'transparent',
        texts: {
          preventOverlap: false,
        },
      },
    });

    this.ogma.events.onNodesSelected((evt) => {
      // this.nodeSelected.emit(evt)
    });

    this.ogma.styles.addRule({
      nodeAttributes: {
        text: {
          minVisibleSize: 0,
          scaling: true,
          scale: 0.5,
        },
      },
    });
  }

  renderOntology(source: any) {
    this.ogma.setGraph(source);
    this.ogma.layouts.forceLink({
      gravity: 0.5,
      duration: 1000,
      scalingRatio: 600,
    });

    this.ogma.styles.addRule({
      nodeAttributes: {
        radius: 16,
        color: this.ogma.rules.map({
          field: 'type',
          values: {
            location: 'blue',
            person: 'red',
            organization: 'green',
          },
        }),
        text: {
          content: function (node) {
            return node.getData('name');
          },
          margin: 0,
          // size: 10,
          scaling: true,
          scale: 0.5,
          // position: "center"
        },
        innerStroke: {
          width: 2,
          // color: "#ddd",
          color: this.ogma.rules.map({
            field: 'type',
            values: {
              location: 'blue',
              person: 'red',
              organization: 'green',
            },
          }),
        },
      },
    });

    // set image
    this.nodeImage();

    // this.forceLink();
  }

  nodeImage() {
    this.ogma.getNodes().forEach((node) => {
      let url = '/assets/img/default.png';

      this.runTestImage(node.getData('type'), node.getData('name'))
        .then((image) => {
          if (image) {
            url = image['src'];
          }

          this.setImageToNode(url, node);
        })
        .catch(() => {
          this.setImageToNode(url, node);
        });
    });
  }

  setImageToNode(url: string, node?): any {
    this.ogma.styles.addRule({
      nodeSelector: (xnode) => {
        if (node) {
          return xnode.getId() == node.getId();
        }
        return null;
      },
      nodeAttributes: {
        image: {
          minVisibleSize: 0,
          url: url,
        },
      },
    });
  }

  mapAssetUrl(type: string, item: string) {
    let name = item.replace(/ /g, '+');
    let url: string = `/cdn/${type}/${name}.jpg`;

    if (type == 'organization') {
      url = `/cdn/organisasi/${name}.jpg`;
    }

    return url;
  }

  imageAvailableOrNot(url: string): Promise<any> {
    const imgElement = new Image();
    const imgPromise = new Promise((resolve, reject) => {
      imgElement.addEventListener('load', () => {
        resolve(imgElement);
      });

      imgElement.addEventListener('error', () => reject());
    });
    imgElement.src = url;
    return imgPromise;
  }

  runTestImage(type: string, item: string): Promise<any> {
    const path = this.mapAssetUrl(type, item);
    const url = 'http://' + window.location.host + path;

    return this.imageAvailableOrNot(url);
  }

  ngOnDestroy() {
    if (this.fetchSubscription) this.fetchSubscription.unsubscribe();
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
