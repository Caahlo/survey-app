import { WindowInterface } from './WindowInterface.js';

declare const window: WindowInterface;

export default function queryStaticLabels() {
  const { labels } = window;
  document.querySelector('html')!.setAttribute('lang', labels.lang);
  document.querySelector('title')!.textContent = labels.appTitle;
}
