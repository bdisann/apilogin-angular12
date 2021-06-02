import { Component, OnInit, Input } from '@angular/core';
import {
  faQuoteRight,
  faReply,
  faRetweet,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-item-content',
  templateUrl: './item-content.component.html',
  styleUrls: ['./item-content.component.css'],
})
export class ItemContentComponent implements OnInit {
  @Input() item: any;
  faReply = faReply;
  faRetweet = faRetweet;
  faQuotes = faQuoteRight;
  constructor() {}

  ngOnInit(): void {}
}
