import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';

export default class StealMyFocus extends Extension {
  constructor(metadata) {
    super(metadata);
  }

  enable() {
    console.debug("Disabling 'Window Is Ready' Notification");

    this._windowDemandsAttentionId = global.display.connect('window-demands-attention', this._onWindowDemandsAttention.bind(this));
    this._windowMarkedUrgentId = global.display.connect('window-marked-urgent', this._onWindowDemandsAttention.bind(this));
  }

  disable() {
    console.debug("Reenabling 'Window Is Ready' Notification");

    global.display.disconnect(this._windowDemandsAttentionId);
    global.display.disconnect(this._windowMarkedUrgentId);
  }

  _onWindowDemandsAttention(display, window) {
    if (!window || window.has_focus() || window.is_skip_taskbar())
      return;

    let settings = this.getSettings();
    let preventDisable = settings.get_boolean('enable-ignorelist');
    let byClassList = settings.get_strv('by-class');

    if (preventDisable && byClassList.includes(window.get_wm_class())) {
      return;
    }

    Main.activateWindow(window);
  }
}
