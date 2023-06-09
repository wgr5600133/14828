// ==UserScript==
// @name         雀魂Mod_Plus(增加新网站适配）感谢原作者
// @name:zh-TW   雀魂Mod_Plus(增加新网站适配）感谢原作者
// @name:zh-HK   雀魂Mod_Plus(增加新网站适配）感谢原作者
// @name:en      MajsoulMod_Plus
// @name:ja      雀魂Mod_Plus
// @namespace    https://github.com/Avenshy
// @version      0.1
// @description       雀魂解锁全角色、皮肤、装扮等，支持全部服务器。
// @description:zh-TW 雀魂解鎖全角色、皮膚、裝扮等，支持全部伺服器。
// @description:zh-HK 雀魂解鎖全角色、皮膚、裝扮等，支持全部服務器。
// @description:en    A majsoul mod that unlocks all characters, skins, decorations, etc. and supports all servers.
// @description:ja    A majsoul mod that unlocks all characters, skins, decorations, etc. and supports all servers.
// @author       Avenshy
// @homepageURL  https://github.com/Avenshy/majsoul_mod_plus
// @supportURL   https://github.com/Avenshy/majsoul_mod_plus/issues
// @match        https://game.maj-soul.com/1/
// @match        https://game.mahjongsoul.com/
// @match        https://game.mahjongsoul.com/index.html
// @match        https://mahjongsoul.game.yo-star.com/
// @match        https://game.maj-soul.net/1/
// @grant        GM_setValue
// @grant        GM_getValue
// @inject-into  auto
// @run-at       document-start
// @license      GPL-3.0
// ==/UserScript==

// 无需在此调整任何设置！正常游戏即可！
// 无需在此调整任何设置！正常游戏即可！
// 无需在此调整任何设置！正常游戏即可！

// ID可以F12打开控制台查询。
// 所有物品 cfg.item_definition.item.map_
// 所有角色 cfg.item_definition.character.map_
// 所有皮肤 cfg.item_definition.skin.map_
// 所有称号 cfg.item_definition.title.map_

class MajsoulModPlus {
    constructor() {
        this.settings = { // 第一次使用的默认设置
            character: 200001, // 当前角色
            characters: { 0: 400101 }, // 各角色使用的皮肤
            star_chars: [], // 星标角色
            commonViewList: [[], [], [], [], []], // 保存装扮
            using_commonview_index: 0, // 使用装扮页
            title: 600021, // 称号
            nickname: '',
            setAuto: {
                isSetAuto: false, // 开关，是否保存状态
                setAutoLiPai: true, // 自动理牌
                setAutoHule: true, // 自动和了
                setAutoNoFulu: false, // 不吃碰杠
                setAutoMoQie: false // 自动摸切
            },
            setbianjietishi: false, // 强制打开便捷提示
            setItems: {
                setAllItems: true, // 开关，是否获得全部道具
                ignoreItems: [309000, 309022, 309023, 309029, 309035]// 不需要获得的道具id
            }
        }
        this.randomBotSkin = true;    //开关，是否随机电脑皮肤
        this.randomPlayerDefSkin = true; //开关，是否随机那些只有默认皮肤的玩家的皮肤
    }

    loadSettings() {
        var temp = {};
        try {
            temp = JSON.parse(GM_getValue('majsoul_mod_plus', '{}'));
        } catch (error) {
            let ca = document.cookie.split(";");
            for (let items of ca) {
                items = items.trim();
                if (items.indexOf('majsoul_mod_plus=') == 0) {
                    temp = JSON.parse(decodeURIComponent(items.substring("majsoul_mod_plus=".length, items.length)));
                    break;
                }
            }

        }
        for (var key in temp) {
            if (this.settings[key] != undefined) {
                this.settings[key] = temp[key];
            }
        }
        this.saveSettings(true);
    }
    saveSettings(isFirstRun) {
        try {
            GM_setValue('majsoul_mod_plus', JSON.stringify(this.settings));
        } catch (error) {
            var d = new Date();
            d.setTime(d.getTime() + (360 * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toGMTString();
            document.cookie = "majsoul_mod_plus=" + encodeURIComponent(JSON.stringify(this.settings)) + "; " + expires;
        }
        if (isFirstRun) {
            console.log('[雀魂mod_plus] 设置已读取：', this.settings);
        } else {
            console.log('[雀魂mod_plus] 设置已保存：', this.settings);
        }
    }
}

!function() {
    var MMP = new MajsoulModPlus;
    if (typeof unsafeWindow !== "undefined") {
        unsafeWindow.MMP = MMP;
    } else {
        console.log("unsafeWindow API not available. Try to inject into window.MMP");
        window.MMP = MMP;
    }
    MMP.loadSettings();
}();

// 取称号id
function getAvatar_id() {
    for (let item of MMP.settings.commonViewList[MMP.settings.using_commonview_index]) {
        if (item.slot == 5) {
            return item.item_id;
        }
    }
    return 305501;
}
// 设置便捷提示
function setAuto() {
    // 自动理牌
    view.DesktopMgr.Inst.auto_liqi = MMP.settings.setAuto.setAutoLiPai;
    view.DesktopMgr.Inst.setAutoLiPai(MMP.settings.setAuto.setAutoLiPai);
    uiscript.UI_DesktopInfo.Inst.refreshFuncBtnShow(uiscript.UI_DesktopInfo.Inst._container_fun.getChildByName("btn_autolipai"), MMP.settings.setAuto.setAutoLiPai);
    Laya.LocalStorage.setItem("autolipai", MMP.settings.setAuto.setAutoLiPai ? "true" : "false");
    // 自动和牌
    view.DesktopMgr.Inst.auto_hule = MMP.settings.setAuto.setAutoHule;
    view.DesktopMgr.Inst.setAutoHule(MMP.settings.setAuto.setAutoHule);
    uiscript.UI_DesktopInfo.Inst.refreshFuncBtnShow(uiscript.UI_DesktopInfo.Inst._container_fun.getChildByName("btn_autohu"), MMP.settings.setAuto.setAutoHule);
    // 不吃碰杠
    view.DesktopMgr.Inst.auto_nofulu = MMP.settings.setAuto.setAutoNoFulu;
    view.DesktopMgr.Inst.setAutoNoFulu(MMP.settings.setAuto.setAutoNoFulu);
    uiscript.UI_DesktopInfo.Inst.refreshFuncBtnShow(uiscript.UI_DesktopInfo.Inst._container_fun.getChildByName("btn_autonoming"), MMP.settings.setAuto.setAutoNoFulu);
    // 自动摸切
    view.DesktopMgr.Inst.auto_moqie = MMP.settings.setAuto.setAutoMoQie;
    view.DesktopMgr.Inst.setAutoMoQie(MMP.settings.setAuto.setAutoMoQie);
    uiscript.UI_DesktopInfo.Inst.refreshFuncBtnShow(uiscript.UI_DesktopInfo.Inst._container_fun.getChildByName("btn_automoqie"), MMP.settings.setAuto.setAutoMoQie);
}

!function majsoul_mod_plus() {
    try {
        // Hack 开启报番型，作者 aoarashi1988，Handle修改
        !function () {
            const arrBackup = cfg.voice.sound.groups_;
            if (!arrBackup || arrBackup.length === 0) {
                throw new Error();
            }
            Object.entries(cfg.voice.sound.groups_).forEach(
                ([soundID, soundGroup]) => {
                    soundGroup.forEach((soundObject, index) => {
                        soundObject.level_limit = 0;
                        soundObject.bond_limit = 0;
                    });
                });
        }
            ();
        // 设置全部道具
        !function (t) {
            var e;
            !function (t) {
                t[t.none = 0] = "none",
                    t[t.daoju = 1] = "daoju",
                    t[t.gift = 2] = "gift",
                    t[t.fudai = 3] = "fudai",
                    t[t.view = 5] = "view"
            }
                (e = t.EItemCategory || (t.EItemCategory = {}));
            var i = function (i) {
                function n() {
                    var t = i.call(this, new ui.lobby.bagUI) || this;
                    return t.container_top = null,
                        t.container_content = null,
                        t.locking = !1,
                        t.tabs = [],
                        t.page_item = null,
                        t.page_gift = null,
                        t.page_skin = null,
                        t.select_index = 0,
                        n.Inst = t,
                        t
                }
                return __extends(n, i),
                    n.init = function () {
                        var t = this;
                        app.NetAgent.AddListener2Lobby("NotifyAccountUpdate", Laya.Handler.create(this, function (e) {
                            var i = e.update;
                            i && i.bag && (t.update_data(i.bag.update_items), t.update_daily_gain_data(i.bag))
                        }, null, !1)),
                            this.fetch()
                    },
                    n.fetch = function () {
                        var e = this;
                        this._item_map = {},
                            this._daily_gain_record = {},
                            app.NetAgent.sendReq2Lobby("Lobby", "fetchBagInfo", {}, function (i, n) {
                                if (i || n.error)
                                    t.UIMgr.Inst.showNetReqError("fetchBagInfo", i, n);
                                else {
                                    app.Log.log("背包信息：" + JSON.stringify(n));
                                    var a = n.bag;
                                    if (a) {
                                        if (MMP.settings.setItems.setAllItems) {
                                            //设置全部道具
                                            var items = cfg.item_definition.item.map_;
                                            for (var id in items) {
                                                if (MMP.settings.setItems.ignoreItems.includes(Number(id))) {
                                                    for (let item of a.items) {
                                                        if (item.item_id == id) {
                                                            cfg.item_definition.item.get(item.item_id);
                                                            e._item_map[item.item_id] = {
                                                                item_id: item.item_id,
                                                                count: item.stack,
                                                                category: items[item.item_id].category
                                                            };
                                                            break;
                                                        }
                                                    }
                                                } else {
                                                    cfg.item_definition.item.get(id);
                                                    e._item_map[id] = {
                                                        item_id: id,
                                                        count: 1,
                                                        category: items[id].category
                                                    }; //获取物品列表并添加
                                                }
                                            }


                                        } else {
                                            if (a.items)
                                                for (var r = 0; r < a.items.length; r++) {
                                                    var s = a.items[r].item_id,
                                                        o = a.items[r].stack,
                                                        l = cfg.item_definition.item.get(s);
                                                    l && (e._item_map[s] = {
                                                        item_id: s,
                                                        count: o,
                                                        category: l.category
                                                    }, 1 == l.category && 3 == l.type && app.NetAgent.sendReq2Lobby("Lobby", "openAllRewardItem", {
                                                        item_id: s
                                                    }, function () { }))
                                                }
                                            if (a.daily_gain_record)
                                                for (var h = a.daily_gain_record, r = 0; r < h.length; r++) {
                                                    var c = h[r].limit_source_id;
                                                    e._daily_gain_record[c] = {};
                                                    var _ = h[r].record_time;
                                                    e._daily_gain_record[c].record_time = _;
                                                    var u = h[r].records;
                                                    if (u)
                                                        for (var d = 0; d < u.length; d++)
                                                            e._daily_gain_record[c][u[d].item_id] = u[d].count
                                                }
                                        }

                                    }
                                }
                            })
                    },
                    n.find_item = function (t) {
                        var e = this._item_map[t];
                        return e ? {
                            item_id: e.item_id,
                            category: e.category,
                            count: e.count
                        }
                            : null
                    },
                    n.get_item_count = function (t) {
                        var e = this.find_item(t);
                        if (e)
                            return e.count;
                        if (100001 == t) {
                            for (var i = 0, n = 0, a = GameMgr.Inst.free_diamonds; n < a.length; n++) {
                                var r = a[n];
                                GameMgr.Inst.account_numerical_resource[r] && (i += GameMgr.Inst.account_numerical_resource[r])
                            }
                            for (var s = 0, o = GameMgr.Inst.paid_diamonds; s < o.length; s++) {
                                var r = o[s];
                                GameMgr.Inst.account_numerical_resource[r] && (i += GameMgr.Inst.account_numerical_resource[r])
                            }
                            return i
                        }
                        if (100004 == t) {
                            for (var l = 0, h = 0, c = GameMgr.Inst.free_pifuquans; h < c.length; h++) {
                                var r = c[h];
                                GameMgr.Inst.account_numerical_resource[r] && (l += GameMgr.Inst.account_numerical_resource[r])
                            }
                            for (var _ = 0, u = GameMgr.Inst.paid_pifuquans; _ < u.length; _++) {
                                var r = u[_];
                                GameMgr.Inst.account_numerical_resource[r] && (l += GameMgr.Inst.account_numerical_resource[r])
                            }
                            return l
                        }
                        return 100002 == t ? GameMgr.Inst.account_data.gold : 0
                    },
                    n.find_items_by_category = function (t) {
                        var e = [];
                        for (var i in this._item_map)
                            this._item_map[i].category == t && e.push({
                                item_id: this._item_map[i].item_id,
                                category: this._item_map[i].category,
                                count: this._item_map[i].count
                            });
                        return e
                    },
                    n.update_data = function (e) {
                        for (var i = 0; i < e.length; i++) {
                            var n = e[i].item_id,
                                a = e[i].stack;
                            if (a > 0) {
                                this._item_map.hasOwnProperty(n.toString()) ? this._item_map[n].count = a : this._item_map[n] = {
                                    item_id: n,
                                    count: a,
                                    category: cfg.item_definition.item.get(n).category
                                };
                                var r = cfg.item_definition.item.get(n);
                                1 == r.category && 3 == r.type && app.NetAgent.sendReq2Lobby("Lobby", "openAllRewardItem", {
                                    item_id: n
                                }, function () { })
                            } else if (this._item_map.hasOwnProperty(n.toString())) {
                                var s = cfg.item_definition.item.get(n);
                                s && 5 == s.category && t.UI_Sushe.on_view_remove(n),
                                    this._item_map[n] = 0,
                                    delete this._item_map[n]
                            }
                        }
                        this.Inst && this.Inst.when_data_change();
                        for (var i = 0; i < e.length; i++) {
                            var n = e[i].item_id;
                            if (this._item_listener.hasOwnProperty(n.toString()))
                                for (var o = this._item_listener[n], l = 0; l < o.length; l++)
                                    o[l].run()
                        }
                        for (var i = 0; i < this._all_item_listener.length; i++)
                            this._all_item_listener[i].run()
                    },
                    n.update_daily_gain_data = function (t) {
                        var e = t.update_daily_gain_record;
                        if (e)
                            for (var i = 0; i < e.length; i++) {
                                var n = e[i].limit_source_id;
                                this._daily_gain_record[n] || (this._daily_gain_record[n] = {});
                                var a = e[i].record_time;
                                this._daily_gain_record[n].record_time = a;
                                var r = e[i].records;
                                if (r)
                                    for (var s = 0; s < r.length; s++)
                                        this._daily_gain_record[n][r[s].item_id] = r[s].count
                            }
                    },
                    n.get_item_daily_record = function (t, e) {
                        return this._daily_gain_record[t] ? this._daily_gain_record[t].record_time ? game.Tools.isPassedRefreshTimeServer(this._daily_gain_record[t].record_time) ? this._daily_gain_record[t][e] ? this._daily_gain_record[t][e] : 0 : 0 : 0 : 0
                    },
                    n.add_item_listener = function (t, e) {
                        this._item_listener.hasOwnProperty(t.toString()) || (this._item_listener[t] = []),
                            this._item_listener[t].push(e)
                    },
                    n.remove_item_listener = function (t, e) {
                        var i = this._item_listener[t];
                        if (i)
                            for (var n = 0; n < i.length; n++)
                                if (i[n] === e) {
                                    i[n] = i[i.length - 1],
                                        i.pop();
                                    break
                                }
                    },
                    n.add_all_item_listener = function (t) {
                        this._all_item_listener.push(t)
                    },
                    n.remove_all_item_listener = function (t) {
                        for (var e = this._all_item_listener, i = 0; i < e.length; i++)
                            if (e[i] === t) {
                                e[i] = e[e.length - 1],
                                    e.pop();
                                break
                            }
                    },
                    n.prototype.have_red_point = function () {
                        return !1
                    },
                    n.prototype.onCreate = function () {
                        var e = this;
                        this.container_top = this.me.getChildByName("top"),
                            this.container_top.getChildByName("btn_back").clickHandler = Laya.Handler.create(this, function () {
                                e.locking || e.hide(Laya.Handler.create(e, function () {
                                    t.UI_Lobby.Inst.enable = !0
                                }))
                            }, null, !1),
                            this.container_content = this.me.getChildByName("content");
                        for (var i = function (t) {
                            n.tabs.push(n.container_content.getChildByName("tabs").getChildByName("btn" + t)),
                                n.tabs[t].clickHandler = Laya.Handler.create(n, function () {
                                    e.select_index != t && e.on_change_tab(t)
                                }, null, !1)
                        }, n = this, a = 0; 4 > a; a++)
                            i(a);
                        this.page_item = new t.UI_Bag_PageItem(this.container_content.getChildByName("page_items")),
                            this.page_gift = new t.UI_Bag_PageGift(this.container_content.getChildByName("page_gift")),
                            this.page_skin = new t.UI_Bag_PageSkin(this.container_content.getChildByName("page_skin"))
                    },
                    n.prototype.show = function (e) {
                        var i = this;
                        void 0 === e && (e = 0),
                            this.enable = !0,
                            this.locking = !0,
                            t.UIBase.anim_alpha_in(this.container_top, {
                                y: -30
                            }, 200),
                            t.UIBase.anim_alpha_in(this.container_content, {
                                y: 30
                            }, 200),
                            Laya.timer.once(300, this, function () {
                                i.locking = !1
                            }),
                            this.on_change_tab(e),
                            game.Scene_Lobby.Inst.change_bg("indoor", !1),
                            3 != e && this.page_skin.when_update_data()
                    },
                    n.prototype.hide = function (e) {
                        var i = this;
                        this.locking = !0,
                            t.UIBase.anim_alpha_out(this.container_top, {
                                y: -30
                            }, 200),
                            t.UIBase.anim_alpha_out(this.container_content, {
                                y: 30
                            }, 200),
                            Laya.timer.once(300, this, function () {
                                i.locking = !1,
                                    i.enable = !1,
                                    e && e.run()
                            })
                    },
                    n.prototype.onDisable = function () {
                        this.page_skin.close()
                        this.page_item.close(),
                            this.page_gift.close()
                    },
                    n.prototype.on_change_tab = function (t) {
                        this.select_index = t;
                        for (var i = 0; i < this.tabs.length; i++)
                            this.tabs[i].skin = game.Tools.localUISrc(t == i ? "myres/shop/tab_choose.png" : "myres/shop/tab_unchoose.png"), this.tabs[i].getChildAt(0).color = t == i ? "#d9b263" : "#8cb65f";
                        switch (this.page_item.close(), this.page_gift.close(), this.page_skin.me.visible = !1, t) {
                            case 0:
                                this.page_item.show(e.daoju);
                                break;
                            case 1:
                                this.page_gift.show();
                                break;
                            case 2:
                                this.page_item.show(e.view);
                                break;
                            case 3:
                                this.page_skin.show()
                        }
                    },
                    n.prototype.when_data_change = function () {
                        this.page_item.me.visible && this.page_item.when_update_data(),
                            this.page_gift.me.visible && this.page_gift.when_update_data()
                    },
                    n.prototype.on_skin_change = function () {
                        this.page_skin.when_update_data()
                    },
                    n.prototype.clear_desktop_btn_redpoint = function () {
                        this.tabs[3].getChildByName("redpoint").visible = !1
                    },
                    n._item_map = {},
                    n._item_listener = {},
                    n._all_item_listener = [],
                    n._daily_gain_record = {},
                    n.Inst = null,
                    n
            }
                (t.UIBase);
            t.UI_Bag = i
        }
            (uiscript || (uiscript = {}));



        // 修改牌桌上角色
        !function (t) {
            var e = function () {
                function e() {
                    var e = this;
                    this.urls = [],
                        this.link_index = -1,
                        this.connect_state = t.EConnectState.none,
                        this.reconnect_count = 0,
                        this.reconnect_span = [500, 1e3, 3e3, 6e3, 1e4, 15e3],
                        this.playerreconnect = !1,
                        this.lasterrortime = 0,
                        this.load_over = !1,
                        this.loaded_player_count = 0,
                        this.real_player_count = 0,
                        this.is_ob = !1,
                        this.ob_token = "",
                        this.lb_index = 0,
                        this._report_reconnect_count = 0,
                        this._connect_start_time = 0,
                        app.NetAgent.AddListener2MJ("NotifyPlayerLoadGameReady", Laya.Handler.create(this, function (t) {
                            app.Log.log("NotifyPlayerLoadGameReady: " + JSON.stringify(t)),
                                e.loaded_player_count = t.ready_id_list.length,
                                e.load_over && uiscript.UI_Loading.Inst.enable && uiscript.UI_Loading.Inst.showLoadCount(e.loaded_player_count, e.real_player_count)
                        }))
                }
                return Object.defineProperty(e, "Inst", {
                    get: function () {
                        return null == this._Inst ? this._Inst = new e : this._Inst
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                    e.prototype.OpenConnect = function (e, i, n, a) {
                        var r = this;
                        uiscript.UI_Loading.Inst.show("enter_mj"),
                            t.Scene_Lobby.Inst && t.Scene_Lobby.Inst.active && (t.Scene_Lobby.Inst.active = !1),
                            this.Close(),
                            view.BgmListMgr.stopBgm(),
                            this.is_ob = !1,
                            Laya.timer.once(500, this, function () {
                                r.url = "",
                                    r.token = e,
                                    r.game_uuid = i,
                                    r.server_location = n,
                                    GameMgr.Inst.ingame = !0,
                                    GameMgr.Inst.mj_server_location = n,
                                    GameMgr.Inst.mj_game_token = e,
                                    GameMgr.Inst.mj_game_uuid = i,
                                    r.playerreconnect = a,
                                    r._setState(t.EConnectState.tryconnect),
                                    r.load_over = !1,
                                    r.loaded_player_count = 0,
                                    r.real_player_count = 0,
                                    r.lb_index = 0,
                                    r._fetch_gateway(0)
                            }),
                            Laya.timer.loop(3e5, this, this.reportInfo)
                    },
                    e.prototype.reportInfo = function () {
                        this.connect_state == t.EConnectState.connecting && GameMgr.Inst.postNewInfo2Server("network_route", {
                            client_type: "web",
                            route_type: "game",
                            route_index: t.LobbyNetMgr.root_id_lst[t.LobbyNetMgr.Inst.choosed_index],
                            route_delay: Math.min(1e4, Math.round(app.NetAgent.mj_network_delay)),
                            connection_time: Math.round(Date.now() - this._connect_start_time),
                            reconnect_count: this._report_reconnect_count
                        })
                    },
                    e.prototype.Close = function () {
                        this.load_over = !1,
                            app.Log.log("MJNetMgr close"),
                            this._setState(t.EConnectState.none),
                            app.NetAgent.Close2MJ(),
                            this.url = "",
                            Laya.timer.clear(this, this.reportInfo)
                    },
                    e.prototype._OnConnent = function (e) {
                        app.Log.log("MJNetMgr _OnConnent event:" + e),
                            e == Laya.Event.CLOSE || e == Laya.Event.ERROR ? Laya.timer.currTimer - this.lasterrortime > 100 && (this.lasterrortime = Laya.timer.currTimer, this.connect_state == t.EConnectState.tryconnect ? this._try_to_linknext() : this.connect_state == t.EConnectState.connecting ? view.DesktopMgr.Inst.active ? (view.DesktopMgr.Inst.duringReconnect = !0, this._setState(t.EConnectState.reconnecting), this.reconnect_count = 0, this._Reconnect()) : (this._setState(t.EConnectState.disconnect), uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(2008)), t.Scene_MJ.Inst.ForceOut()) : this.connect_state == t.EConnectState.reconnecting && this._Reconnect()) : e == Laya.Event.OPEN && (this._connect_start_time = Date.now(), (this.connect_state == t.EConnectState.tryconnect || this.connect_state == t.EConnectState.reconnecting) && ((this.connect_state = t.EConnectState.tryconnect) ? this._report_reconnect_count = 0 : this._report_reconnect_count++, this._setState(t.EConnectState.connecting), this.is_ob ? this._ConnectSuccessOb() : this._ConnectSuccess()))
                    },
                    e.prototype._Reconnect = function () {
                        var e = this;
                        t.LobbyNetMgr.Inst.connect_state == t.EConnectState.none || t.LobbyNetMgr.Inst.connect_state == t.EConnectState.disconnect ? this._setState(t.EConnectState.disconnect) : t.LobbyNetMgr.Inst.connect_state == t.EConnectState.connecting && GameMgr.Inst.logined ? this.reconnect_count >= this.reconnect_span.length ? this._setState(t.EConnectState.disconnect) : (Laya.timer.once(this.reconnect_span[this.reconnect_count], this, function () {
                            e.connect_state == t.EConnectState.reconnecting && (app.Log.log("MJNetMgr reconnect count:" + e.reconnect_count), app.NetAgent.connect2MJ(e.url, Laya.Handler.create(e, e._OnConnent, null, !1), "local" == e.server_location ? "/game-gateway" : "/game-gateway-zone"))
                        }), this.reconnect_count++) : Laya.timer.once(1e3, this, this._Reconnect)
                    },
                    e.prototype._try_to_linknext = function () {
                        this.link_index++,
                            this.url = "",
                            app.Log.log("mj _try_to_linknext(" + this.link_index + ") url.length=" + this.urls.length),
                            this.link_index < 0 || this.link_index >= this.urls.length ? t.LobbyNetMgr.Inst.polling_connect ? (this.lb_index++, this._fetch_gateway(0)) : (this._setState(t.EConnectState.none), uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(59)), this._SendDebugInfo(), view.DesktopMgr.Inst && !view.DesktopMgr.Inst.active && t.Scene_MJ.Inst.ForceOut()) : (app.NetAgent.connect2MJ(this.urls[this.link_index].url, Laya.Handler.create(this, this._OnConnent, null, !1), "local" == this.server_location ? "/game-gateway" : "/game-gateway-zone"), this.url = this.urls[this.link_index].url)
                    },
                    e.prototype.GetAuthData = function () {
                        return {
                            account_id: GameMgr.Inst.account_id,
                            token: this.token,
                            game_uuid: this.game_uuid,
                            gift: CryptoJS.HmacSHA256(this.token + GameMgr.Inst.account_id + this.game_uuid, "damajiang").toString()
                        }
                    },
                    e.prototype._fetch_gateway = function (e) {
                        var i = this;
                        if (t.LobbyNetMgr.Inst.polling_connect && this.lb_index >= t.LobbyNetMgr.Inst.urls.length)
                            return uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(58)), this._SendDebugInfo(), view.DesktopMgr.Inst && !view.DesktopMgr.Inst.active && t.Scene_MJ.Inst.ForceOut(), this._setState(t.EConnectState.none), void 0;
                        this.urls = [],
                            this.link_index = -1,
                            app.Log.log("mj _fetch_gateway retry_count:" + e);
                        var n = function (n) {
                            var a = JSON.parse(n);
                            if (app.Log.log("mj _fetch_gateway func_success data = " + n), a.maintenance)
                                i._setState(t.EConnectState.none), uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(2009)), view.DesktopMgr.Inst && !view.DesktopMgr.Inst.active && t.Scene_MJ.Inst.ForceOut();
                            else if (a.servers && a.servers.length > 0) {
                                for (var r = a.servers, s = t.Tools.deal_gateway(r), o = 0; o < s.length; o++)
                                    i.urls.push({
                                        name: "___" + o,
                                        url: s[o]
                                    });
                                i.link_index = -1,
                                    i._try_to_linknext()
                            } else
                                1 > e ? Laya.timer.once(1e3, i, function () {
                                    i._fetch_gateway(e + 1)
                                }) : t.LobbyNetMgr.Inst.polling_connect ? (i.lb_index++, i._fetch_gateway(0)) : (uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(60)), i._SendDebugInfo(), view.DesktopMgr.Inst && !view.DesktopMgr.Inst.active && t.Scene_MJ.Inst.ForceOut(), i._setState(t.EConnectState.none))
                        },
                            a = function () {
                                app.Log.log("mj _fetch_gateway func_error"),
                                    1 > e ? Laya.timer.once(500, i, function () {
                                        i._fetch_gateway(e + 1)
                                    }) : t.LobbyNetMgr.Inst.polling_connect ? (i.lb_index++, i._fetch_gateway(0)) : (uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(58)), i._SendDebugInfo(), view.DesktopMgr.Inst.active || t.Scene_MJ.Inst.ForceOut(), i._setState(t.EConnectState.none))
                            },
                            r = function (t) {
                                var e = new Laya.HttpRequest;
                                e.once(Laya.Event.COMPLETE, i, function (t) {
                                    n(t)
                                }),
                                    e.once(Laya.Event.ERROR, i, function () {
                                        a()
                                    });
                                var r = [];
                                r.push("If-Modified-Since"),
                                    r.push("0"),
                                    t += "?service=ws-game-gateway",
                                    t += GameMgr.inHttps ? "&protocol=ws&ssl=true" : "&protocol=ws&ssl=false",
                                    t += "&location=" + i.server_location,
                                    t += "&rv=" + Math.floor(1e7 * Math.random()) + Math.floor(1e7 * Math.random()),
                                    e.send(t, "", "get", "text", r),
                                    app.Log.log("mj _fetch_gateway func_fetch url = " + t)
                            };
                        t.LobbyNetMgr.Inst.polling_connect ? r(t.LobbyNetMgr.Inst.urls[this.lb_index]) : r(t.LobbyNetMgr.Inst.lb_url)
                    },
                    e.prototype._setState = function (e) {
                        this.connect_state = e,
                            GameMgr.inRelease || null != uiscript.UI_Common.Inst && (e == t.EConnectState.none ? uiscript.UI_Common.Inst.label_net_mj.text = "" : e == t.EConnectState.tryconnect ? (uiscript.UI_Common.Inst.label_net_mj.text = "尝试连接麻将服务器", uiscript.UI_Common.Inst.label_net_mj.color = "#000000") : e == t.EConnectState.connecting ? (uiscript.UI_Common.Inst.label_net_mj.text = "麻将服务器：正常", uiscript.UI_Common.Inst.label_net_mj.color = "#00ff00") : e == t.EConnectState.disconnect ? (uiscript.UI_Common.Inst.label_net_mj.text = "麻将服务器：断开连接", uiscript.UI_Common.Inst.label_net_mj.color = "#ff0000", uiscript.UI_Disconnect.Inst && uiscript.UI_Disconnect.Inst.show()) : e == t.EConnectState.reconnecting && (uiscript.UI_Common.Inst.label_net_mj.text = "麻将服务器：正在重连", uiscript.UI_Common.Inst.label_net_mj.color = "#ff0000", uiscript.UI_Disconnect.Inst && uiscript.UI_Disconnect.Inst.show()))
                    },
                    e.prototype._ConnectSuccess = function () {
                        var e = this;
                        app.Log.log("MJNetMgr _ConnectSuccess "),
                            this.load_over = !1,
                            app.NetAgent.sendReq2MJ("FastTest", "authGame", this.GetAuthData(), function (i, n) {
                                if (i || n.error)
                                    uiscript.UIMgr.Inst.showNetReqError("authGame", i, n), t.Scene_MJ.Inst.GameEnd(), view.BgmListMgr.PlayLobbyBgm();
                                else {
                                    app.Log.log("麻将桌验证通过：" + JSON.stringify(n)),
                                        uiscript.UI_Loading.Inst.setProgressVal(.1);
                                    // 强制打开便捷提示
                                    if (MMP.settings.setbianjietishi) {
                                        n.game_config.mode.detail_rule.bianjietishi = true;
                                    }
                                    // END
                                    // 增加对mahjong-helper的兼容
                                    let req = new XMLHttpRequest();
                                    req.open("POST", "https://localhost:12121/");
                                    req.send(JSON.stringify(n));
                                    //END
                                    var a = [],
                                        r = 0;
                                    view.DesktopMgr.player_link_state = n.state_list;
                                    var s = t.Tools.strOfLocalization(2003),
                                        o = n.game_config.mode,
                                        l = view.ERuleMode.Liqi4;
                                    o.mode < 10 ? (l = view.ERuleMode.Liqi4, e.real_player_count = 4) : o.mode < 20 && (l = view.ERuleMode.Liqi3, e.real_player_count = 3);
                                    for (var h = 0; h < e.real_player_count; h++)
                                        a.push(null);
                                    o.extendinfo && (s = t.Tools.strOfLocalization(2004)),
                                        o.detail_rule && o.detail_rule.ai_level && (1 === o.detail_rule.ai_level && (s = t.Tools.strOfLocalization(2003)), 2 === o.detail_rule.ai_level && (s = t.Tools.strOfLocalization(2004)));
                                    for (var c = t.GameUtility.get_default_ai_skin(), _ = t.GameUtility.get_default_ai_character(), h = 0; h < n.seat_list.length; h++) {
                                        var u = n.seat_list[h];
                                        if (0 == u) {
                                            a[h] = {
                                                nickname: s,
                                                avatar_id: c,
                                                level: {
                                                    id: 10101
                                                },
                                                level3: {
                                                    id: 20101
                                                },
                                                character: {
                                                    charid: _,
                                                    level: 0,
                                                    exp: 0,
                                                    views: [],
                                                    skin: c,
                                                    is_upgraded: !1
                                                }
                                            };
                                            //随机化电脑皮肤
                                            if(MMP.randomBotSkin)
                                            {
                                                let all_keys = Object.keys(cfg.item_definition.skin.map_);
                                                let rand_skin_id = parseInt(Math.random()*all_keys.length,10);
                                                let skin = cfg.item_definition.skin.map_[all_keys[rand_skin_id]];
                                                a[h].avatar_id = skin.id;
                                                a[h].character.charid = skin.character_id;
                                                a[h].character.skin = skin.id;
                                            }

                                        }
                                        else {
                                            r++;
                                            for (var d = 0; d < n.players.length; d++)

                                                if (n.players[d].account_id == u) {
                                                    a[h] = n.players[d];
                                                    //修改牌桌上人物头像及皮肤
                                                    if (a[h].account_id == GameMgr.Inst.account_id) {
                                                        a[h].character = uiscript.UI_Sushe.characters[uiscript.UI_Sushe.main_character_id - 200001];
                                                        a[h].avatar_id = uiscript.UI_Sushe.main_chara_info.skin;
                                                        a[h].views = uiscript.UI_Sushe.commonViewList[uiscript.UI_Sushe.using_commonview_index];
                                                        a[h].avatar_frame = GameMgr.Inst.account_data.avatar_frame;
                                                        a[h].title = GameMgr.Inst.account_data.title;
                                                        if (MMP.settings.nickname != '') {
                                                            a[h].nickname = MMP.settings.nickname;
                                                        }
                                                    }
                                                    else if(MMP.randomPlayerDefSkin && (a[h].avatar_id == 400101 || a[h].avatar_id == 400201))
                                                    {
                                                        //玩家如果用了默认皮肤也随机换
                                                        let all_keys = Object.keys(cfg.item_definition.skin.map_);
                                                        let rand_skin_id = parseInt(Math.random()*all_keys.length,10);
                                                        let skin = cfg.item_definition.skin.map_[all_keys[rand_skin_id]];
                                                        a[h].avatar_id = skin.id;
                                                        a[h].character.charid = skin.character_id;
                                                        a[h].character.skin = skin.id;
                                                    }
                                                    // END
                                                    //break

                                                }
                                        }
                                    }
                                    for (var h = 0; h < e.real_player_count; h++)
                                        null == a[h] && (a[h] = {
                                            account: 0,
                                            nickname: t.Tools.strOfLocalization(2010),
                                            avatar_id: c,
                                            level: {
                                                id: 10101
                                            },
                                            level3: {
                                                id: 20101
                                            },
                                            character: {
                                                charid: _,
                                                level: 0,
                                                exp: 0,
                                                views: [],
                                                skin: c,
                                                is_upgraded: !1
                                            }
                                        });
                                    e.loaded_player_count = n.ready_id_list.length,
                                        e._AuthSuccess(a, n.is_game_start, n.game_config.toJSON())
                                }
                            })
                    },
                    e.prototype._AuthSuccess = function (e, i, n) {
                        var a = this;
                        view.DesktopMgr.Inst && view.DesktopMgr.Inst.active ? (this.load_over = !0, Laya.timer.once(500, this, function () {
                            app.Log.log("重连信息1 round_id:" + view.DesktopMgr.Inst.round_id + " step:" + view.DesktopMgr.Inst.current_step),
                                view.DesktopMgr.Inst.Reset(),
                                view.DesktopMgr.Inst.duringReconnect = !0,
                                uiscript.UI_Loading.Inst.setProgressVal(.2),
                                app.NetAgent.sendReq2MJ("FastTest", "syncGame", {
                                    round_id: view.DesktopMgr.Inst.round_id,
                                    step: view.DesktopMgr.Inst.current_step
                                }, function (e, i) {
                                    e || i.error ? (uiscript.UIMgr.Inst.showNetReqError("syncGame", e, i), t.Scene_MJ.Inst.ForceOut()) : (app.Log.log("[syncGame] " + JSON.stringify(i)), i.isEnd ? (uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(2011)), t.Scene_MJ.Inst.GameEnd()) : (uiscript.UI_Loading.Inst.setProgressVal(.3), view.DesktopMgr.Inst.fetchLinks(), view.DesktopMgr.Inst.Reset(), view.DesktopMgr.Inst.duringReconnect = !0, view.DesktopMgr.Inst.syncGameByStep(i.game_restore)))
                                })
                        })) : t.Scene_MJ.Inst.openMJRoom(n, e, Laya.Handler.create(this, function () {
                            view.DesktopMgr.Inst.initRoom(JSON.parse(JSON.stringify(n)), e, GameMgr.Inst.account_id, view.EMJMode.play, Laya.Handler.create(a, function () {
                                i ? Laya.timer.frameOnce(10, a, function () {
                                    app.Log.log("重连信息2 round_id:-1 step:" + 1e6),
                                        view.DesktopMgr.Inst.Reset(),
                                        view.DesktopMgr.Inst.duringReconnect = !0,
                                        app.NetAgent.sendReq2MJ("FastTest", "syncGame", {
                                            round_id: "-1",
                                            step: 1e6
                                        }, function (e, i) {
                                            app.Log.log("syncGame " + JSON.stringify(i)),
                                                e || i.error ? (uiscript.UIMgr.Inst.showNetReqError("syncGame", e, i), t.Scene_MJ.Inst.ForceOut()) : (uiscript.UI_Loading.Inst.setProgressVal(1), view.DesktopMgr.Inst.fetchLinks(), a._PlayerReconnectSuccess(i))
                                        })
                                }) : Laya.timer.frameOnce(10, a, function () {
                                    app.Log.log("send enterGame"),
                                        view.DesktopMgr.Inst.Reset(),
                                        view.DesktopMgr.Inst.duringReconnect = !0,
                                        app.NetAgent.sendReq2MJ("FastTest", "enterGame", {}, function (e, i) {
                                            e || i.error ? (uiscript.UIMgr.Inst.showNetReqError("enterGame", e, i), t.Scene_MJ.Inst.ForceOut()) : (uiscript.UI_Loading.Inst.setProgressVal(1), app.Log.log("enterGame"), a._EnterGame(i), view.DesktopMgr.Inst.fetchLinks())
                                        })
                                })
                            }))
                        }), Laya.Handler.create(this, function (t) {
                            return uiscript.UI_Loading.Inst.setProgressVal(.1 + .8 * t)
                        }, null, !1))
                    },
                    e.prototype._EnterGame = function (e) {
                        app.Log.log("正常进入游戏: " + JSON.stringify(e)),
                            e.is_end ? (uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(2011)), t.Scene_MJ.Inst.GameEnd()) : e.game_restore ? view.DesktopMgr.Inst.syncGameByStep(e.game_restore) : (this.load_over = !0, this.load_over && uiscript.UI_Loading.Inst.enable && uiscript.UI_Loading.Inst.showLoadCount(this.loaded_player_count, this.real_player_count), view.DesktopMgr.Inst.duringReconnect = !1, view.DesktopMgr.Inst.StartChainAction(0))
                    },
                    e.prototype._PlayerReconnectSuccess = function (e) {
                        app.Log.log("_PlayerReconnectSuccess data:" + JSON.stringify(e)),
                            e.isEnd ? (uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(2011)), t.Scene_MJ.Inst.GameEnd()) : e.game_restore ? view.DesktopMgr.Inst.syncGameByStep(e.game_restore) : (uiscript.UIMgr.Inst.ShowErrorInfo(t.Tools.strOfLocalization(2012)), t.Scene_MJ.Inst.ForceOut())
                    },
                    e.prototype._SendDebugInfo = function () { },
                    e.prototype.OpenConnectObserve = function (e, i) {
                        var n = this;
                        this.is_ob = !0,
                            uiscript.UI_Loading.Inst.show("enter_mj"),
                            this.Close(),
                            view.AudioMgr.StopMusic(),
                            Laya.timer.once(500, this, function () {
                                n.server_location = i,
                                    n.ob_token = e,
                                    n._setState(t.EConnectState.tryconnect),
                                    n.lb_index = 0,
                                    n._fetch_gateway(0)
                            })
                    },
                    e.prototype._ConnectSuccessOb = function () {
                        var e = this;
                        app.Log.log("MJNetMgr _ConnectSuccessOb "),
                            app.NetAgent.sendReq2MJ("FastTest", "authObserve", {
                                token: this.ob_token
                            }, function (i, n) {
                                i || n.error ? (uiscript.UIMgr.Inst.showNetReqError("authObserve", i, n), t.Scene_MJ.Inst.GameEnd(), view.BgmListMgr.PlayLobbyBgm()) : (app.Log.log("实时OB验证通过：" + JSON.stringify(n)), uiscript.UI_Loading.Inst.setProgressVal(.3), uiscript.UI_Live_Broadcast.Inst && uiscript.UI_Live_Broadcast.Inst.clearPendingUnits(), app.NetAgent.sendReq2MJ("FastTest", "startObserve", {}, function (i, n) {
                                    if (i || n.error)
                                        uiscript.UIMgr.Inst.showNetReqError("startObserve", i, n), t.Scene_MJ.Inst.GameEnd(), view.BgmListMgr.PlayLobbyBgm();
                                    else {
                                        var a = n.head,
                                            r = a.game_config.mode,
                                            s = [],
                                            o = t.Tools.strOfLocalization(2003),
                                            l = view.ERuleMode.Liqi4;
                                        r.mode < 10 ? (l = view.ERuleMode.Liqi4, e.real_player_count = 4) : r.mode < 20 && (l = view.ERuleMode.Liqi3, e.real_player_count = 3);
                                        for (var h = 0; h < e.real_player_count; h++)
                                            s.push(null);
                                        r.extendinfo && (o = t.Tools.strOfLocalization(2004)),
                                            r.detail_rule && r.detail_rule.ai_level && (1 === r.detail_rule.ai_level && (o = t.Tools.strOfLocalization(2003)), 2 === r.detail_rule.ai_level && (o = t.Tools.strOfLocalization(2004)));
                                        for (var c = t.GameUtility.get_default_ai_skin(), _ = t.GameUtility.get_default_ai_character(), h = 0; h < a.seat_list.length; h++) {
                                            var u = a.seat_list[h];
                                            if (0 == u)
                                                s[h] = {
                                                    nickname: o,
                                                    avatar_id: c,
                                                    level: {
                                                        id: 10101
                                                    },
                                                    level3: {
                                                        id: 20101
                                                    },
                                                    character: {
                                                        charid: _,
                                                        level: 0,
                                                        exp: 0,
                                                        views: [],
                                                        skin: c,
                                                        is_upgraded: !1
                                                    }
                                                };
                                            else
                                                for (var d = 0; d < a.players.length; d++)
                                                    if (a.players[d].account_id == u) {
                                                        s[h] = a.players[d];
                                                        break
                                                    }
                                        }
                                        for (var h = 0; h < e.real_player_count; h++)
                                            null == s[h] && (s[h] = {
                                                account: 0,
                                                nickname: t.Tools.strOfLocalization(2010),
                                                avatar_id: c,
                                                level: {
                                                    id: 10101
                                                },
                                                level3: {
                                                    id: 20101
                                                },
                                                character: {
                                                    charid: _,
                                                    level: 0,
                                                    exp: 0,
                                                    views: [],
                                                    skin: c,
                                                    is_upgraded: !1
                                                }
                                            });
                                        e._StartObSuccuess(s, n.passed, a.game_config.toJSON(), a.start_time)
                                    }
                                }))
                            })
                    },
                    e.prototype._StartObSuccuess = function (e, i, n, a) {
                        var r = this;
                        view.DesktopMgr.Inst && view.DesktopMgr.Inst.active ? (this.load_over = !0, Laya.timer.once(500, this, function () {
                            app.Log.log("重连信息1 round_id:" + view.DesktopMgr.Inst.round_id + " step:" + view.DesktopMgr.Inst.current_step),
                                view.DesktopMgr.Inst.Reset(),
                                uiscript.UI_Live_Broadcast.Inst.startRealtimeLive(a, i)
                        })) : (uiscript.UI_Loading.Inst.setProgressVal(.4), t.Scene_MJ.Inst.openMJRoom(n, e, Laya.Handler.create(this, function () {
                            view.DesktopMgr.Inst.initRoom(JSON.parse(JSON.stringify(n)), e, GameMgr.Inst.account_id, view.EMJMode.live_broadcast, Laya.Handler.create(r, function () {
                                uiscript.UI_Loading.Inst.setProgressVal(.9),
                                    Laya.timer.once(1e3, r, function () {
                                        GameMgr.Inst.EnterMJ(),
                                            uiscript.UI_Loading.Inst.setProgressVal(.95),
                                            uiscript.UI_Live_Broadcast.Inst.startRealtimeLive(a, i)
                                    })
                            }))
                        }), Laya.Handler.create(this, function (t) {
                            return uiscript.UI_Loading.Inst.setProgressVal(.4 + .4 * t)
                        }, null, !1)))
                    },
                    e._Inst = null,
                    e
            }
                ();
            t.MJNetMgr = e
        }
            (game || (game = {}));



        // 读取战绩
        !function (t) {
            var e = function (e) {
                function i() {
                    var t = e.call(this, "chs" == GameMgr.client_language || "chs_t" == GameMgr.client_language ? new ui.both_ui.otherplayerinfoUI : new ui.both_ui.otherplayerinfo_enUI) || this;
                    return t.account_id = 0,
                        t.origin_x = 0,
                        t.origin_y = 0,
                        t.root = null,
                        t.title = null,
                        t.level = null,
                        t.btn_addfriend = null,
                        t.btn_report = null,
                        t.illust = null,
                        t.name = null,
                        t.detail_data = null,
                        t.achievement_data = null,
                        t.locking = !1,
                        t.tab_info4 = null,
                        t.tab_info3 = null,
                        t.tab_note = null,
                        t.tab_img_dark = "",
                        t.tab_img_chosen = "",
                        t.player_data = null,
                        t.tab_index = 1,
                        t.game_category = 1,
                        t.game_type = 1,
                        i.Inst = t,
                        t
                }
                return __extends(i, e),
                    i.prototype.onCreate = function () {
                        var e = this;
                        "chs" == GameMgr.client_language || "chs_t" == GameMgr.client_language ? (this.tab_img_chosen = game.Tools.localUISrc("myres/bothui/info_tab_chosen.png"), this.tab_img_dark = game.Tools.localUISrc("myres/bothui/info_tab_dark.png")) : (this.tab_img_chosen = game.Tools.localUISrc("myres/bothui/info_tabheng_chosen.png"), this.tab_img_dark = game.Tools.localUISrc("myres/bothui/info_tabheng_dark.png")),
                            this.root = this.me.getChildByName("root"),
                            this.origin_x = this.root.x,
                            this.origin_y = this.root.y,
                            this.container_info = this.root.getChildByName("container_info"),
                            this.title = new t.UI_PlayerTitle(this.container_info.getChildByName("title"), "UI_OtherPlayerInfo"),
                            this.name = this.container_info.getChildByName("name"),
                            this.level = new t.UI_Level(this.container_info.getChildByName("rank"), "UI_OtherPlayerInfo"),
                            this.detail_data = new t.UI_PlayerData(this.container_info.getChildByName("data")),
                            this.achievement_data = new t.UI_Achievement_Light(this.container_info.getChildByName("achievement")),
                            this.illust = new t.UI_Character_Skin(this.root.getChildByName("illust").getChildByName("illust")),
                            this.btn_addfriend = this.container_info.getChildByName("btn_add"),
                            this.btn_addfriend.clickHandler = Laya.Handler.create(this, function () {
                                e.btn_addfriend.visible = !1,
                                    e.btn_report.x = 343,
                                    app.NetAgent.sendReq2Lobby("Lobby", "applyFriend", {
                                        target_id: e.account_id
                                    }, function () { })
                            }, null, !1),
                            this.btn_report = this.container_info.getChildByName("btn_report"),
                            this.btn_report.clickHandler = new Laya.Handler(this, function () {
                                t.UI_Report_Nickname.Inst.show(e.account_id)
                            }),
                            this.me.getChildAt(0).clickHandler = Laya.Handler.create(this, function () {
                                e.locking || e.close()
                            }, null, !1),
                            this.root.getChildByName("btn_close").clickHandler = Laya.Handler.create(this, function () {
                                e.close()
                            }, null, !1),
                            this.note = new t.UI_PlayerNote(this.root.getChildByName("container_note"), null),
                            this.tab_info4 = this.root.getChildByName("tab_info4"),
                            this.tab_info4.clickHandler = Laya.Handler.create(this, function () {
                                e.locking || 1 != e.tab_index && e.changeMJCategory(1)
                            }, null, !1),
                            this.tab_info3 = this.root.getChildByName("tab_info3"),
                            this.tab_info3.clickHandler = Laya.Handler.create(this, function () {
                                e.locking || 2 != e.tab_index && e.changeMJCategory(2)
                            }, null, !1),
                            this.tab_note = this.root.getChildByName("tab_note"),
                            this.tab_note.clickHandler = Laya.Handler.create(this, function () {
                                e.locking || "chs" != GameMgr.client_type && "chs_t" != GameMgr.client_type && (game.Tools.during_chat_close() ? t.UIMgr.Inst.ShowErrorInfo("功能维护中，祝大家新年快乐") : e.container_info.visible && (e.container_info.visible = !1, e.tab_info4.skin = e.tab_img_dark, e.tab_info3.skin = e.tab_img_dark, e.tab_note.skin = e.tab_img_chosen, e.tab_index = 3, e.note.show()))
                            }, null, !1),
                            this.locking = !1
                    },
                    i.prototype.show = function (e, i, n, a) {
                        var r = this;
                        void 0 === i && (i = 1),
                            void 0 === n && (n = 2),
                            void 0 === a && (a = 1),
                            GameMgr.Inst.BehavioralStatistics(14),
                            this.account_id = e,
                            this.enable = !0,
                            this.locking = !0,
                            this.root.y = this.origin_y,
                            this.player_data = null,
                            t.UIBase.anim_pop_out(this.root, Laya.Handler.create(this, function () {
                                r.locking = !1
                            })),
                            this.detail_data.reset(),
                            app.NetAgent.sendReq2Lobby("Lobby", "fetchAccountStatisticInfo", {
                                account_id: e
                            }, function (i, n) {
                                i || n.error ? t.UIMgr.Inst.showNetReqError("fetchAccountStatisticInfo", i, n) : t.UI_Shilian.now_season_info && 1001 == t.UI_Shilian.now_season_info.season_id && 3 != t.UI_Shilian.get_cur_season_state() ? (r.detail_data.setData(n), r.changeMJCategory(r.tab_index, r.game_category, r.game_type)) : app.NetAgent.sendReq2Lobby("Lobby", "fetchAccountChallengeRankInfo", {
                                    account_id: e
                                }, function (e, i) {
                                    e || i.error ? t.UIMgr.Inst.showNetReqError("fetchAccountChallengeRankInfo", e, i) : (n.season_info = i.season_info, r.detail_data.setData(n), r.changeMJCategory(r.tab_index, r.game_category, r.game_type))
                                })
                            }),
                            this.note.init_data(e),
                            this.refreshBaseInfo(),
                            this.btn_report.visible = e != GameMgr.Inst.account_id,
                            this.tab_index = i,
                            this.game_category = n,
                            this.game_type = a,
                            this.container_info.visible = !0,
                            this.tab_info4.skin = 1 == this.tab_index ? this.tab_img_chosen : this.tab_img_dark,
                            this.tab_info3.skin = 2 == this.tab_index ? this.tab_img_chosen : this.tab_img_dark,
                            this.tab_note.skin = this.tab_img_dark,
                            this.note.close(),
                            this.tab_note.visible = "chs" != GameMgr.client_type && "chs_t" != GameMgr.client_type,
                            this.player_data ? (this.level.id = this.player_data[1 == this.tab_index ? "level" : "level3"].id, this.level.exp = this.player_data[1 == this.tab_index ? "level" : "level3"].score) : (this.level.id = 1 == this.tab_index ? 10101 : 20101, this.level.exp = 0)
                    },
                    i.prototype.refreshBaseInfo = function () {
                        var e = this;
                        this.title.id = 0,
                            this.illust.me.visible = !1,
                            game.Tools.SetNickname(this.name, {
                                account_id: 0,
                                nickname: "",
                                verified: 0
                            }),
                            this.btn_addfriend.visible = !1,
                            this.btn_report.x = 343,
                            app.NetAgent.sendReq2Lobby("Lobby", "fetchAccountInfo", {
                                account_id: this.account_id
                            }, function (i, n) {
                                if (i || n.error)
                                    t.UIMgr.Inst.showNetReqError("fetchAccountInfo", i, n);
                                else {
                                    var a = n.account;
                                    //修复读取战绩信息时人物皮肤不一致问题 ----fxxk
                                    if (a.account_id == GameMgr.Inst.account_id) {
                                        a.avatar_id = uiscript.UI_Sushe.main_chara_info.skin,
                                            a.title = GameMgr.Inst.account_data.title;
                                        if (MMP.settings.nickname != '') {
                                            a.nickname = MMP.settings.nickname;
                                        }
                                    }
                                    //end
                                    e.player_data = a,
                                        game.Tools.SetNickname(e.name, a),
                                        e.title.id = game.Tools.titleLocalization(a.account_id, a.title),
                                        e.level.id = a.level.id,
                                        e.level.id = e.player_data[1 == e.tab_index ? "level" : "level3"].id,
                                        e.level.exp = e.player_data[1 == e.tab_index ? "level" : "level3"].score,
                                        e.illust.me.visible = !0,
                                        e.account_id == GameMgr.Inst.account_id ? e.illust.setSkin(a.avatar_id, "waitingroom") : e.illust.setSkin(game.GameUtility.get_limited_skin_id(a.avatar_id), "waitingroom"),
                                        game.Tools.is_same_zone(GameMgr.Inst.account_id, e.account_id) && e.account_id != GameMgr.Inst.account_id && null == game.FriendMgr.find(e.account_id) ? (e.btn_addfriend.visible = !0, e.btn_report.x = 520) : (e.btn_addfriend.visible = !1, e.btn_report.x = 343),
                                        e.note.sign.setSign(a.signature),
                                        e.achievement_data.show(!1, a.achievement_count)

                                }
                            })
                    },
                    i.prototype.changeMJCategory = function (t, e, i) {
                        void 0 === e && (e = 2),
                            void 0 === i && (i = 1),
                            this.tab_index = t,
                            this.container_info.visible = !0,
                            this.detail_data.changeMJCategory(t, e, i),
                            this.tab_info4.skin = 1 == this.tab_index ? this.tab_img_chosen : this.tab_img_dark,
                            this.tab_info3.skin = 2 == this.tab_index ? this.tab_img_chosen : this.tab_img_dark,
                            this.tab_note.skin = this.tab_img_dark,
                            this.note.close(),
                            this.player_data ? (this.level.id = this.player_data[1 == this.tab_index ? "level" : "level3"].id, this.level.exp = this.player_data[1 == this.tab_index ? "level" : "level3"].score) : (this.level.id = 1 == this.tab_index ? 10101 : 20101, this.level.exp = 0)
                    },
                    i.prototype.close = function () {
                        var e = this;
                        this.enable && (this.locking || (this.locking = !0, this.detail_data.close(), t.UIBase.anim_pop_hide(this.root, Laya.Handler.create(this, function () {
                            e.locking = !1,
                                e.enable = !1
                        }))))
                    },
                    i.prototype.onEnable = function () {
                        game.TempImageMgr.setUIEnable("UI_OtherPlayerInfo", !0)
                    },
                    i.prototype.onDisable = function () {
                        game.TempImageMgr.setUIEnable("UI_OtherPlayerInfo", !1),
                            this.detail_data.close(),
                            this.illust.clear(),
                            Laya.loader.clearTextureRes(this.level.icon.skin)
                    },
                    i.Inst = null,
                    i
            }
                (t.UIBase);
            t.UI_OtherPlayerInfo = e
        }
            (uiscript || (uiscript = {}));



        // 宿舍相关
        !function (t) {
            var e = function () {
                function e(e, n) {
                    var a = this;
                    this._scale = 1,
                        this.during_move = !1,
                        this.mouse_start_x = 0,
                        this.mouse_start_y = 0,
                        this.me = e,
                        this.container_illust = n,
                        this.illust = this.container_illust.getChildByName("illust"),
                        this.container_move = e.getChildByName("move"),
                        this.container_move.on("mousedown", this, function () {
                            a.during_move = !0,
                                a.mouse_start_x = a.container_move.mouseX,
                                a.mouse_start_y = a.container_move.mouseY
                        }),
                        this.container_move.on("mousemove", this, function () {
                            a.during_move && (a.move(a.container_move.mouseX - a.mouse_start_x, a.container_move.mouseY - a.mouse_start_y), a.mouse_start_x = a.container_move.mouseX, a.mouse_start_y = a.container_move.mouseY)
                        }),
                        this.container_move.on("mouseup", this, function () {
                            a.during_move = !1
                        }),
                        this.container_move.on("mouseout", this, function () {
                            a.during_move = !1
                        }),
                        this.btn_big = e.getChildByName("btn_big"),
                        this.btn_big.clickHandler = Laya.Handler.create(this, function () {
                            a.locking || a.bigger()
                        }, null, !1),
                        this.btn_small = e.getChildByName("btn_small"),
                        this.btn_small.clickHandler = Laya.Handler.create(this, function () {
                            a.locking || a.smaller()
                        }, null, !1),
                        this.btn_close = e.getChildByName("btn_close"),
                        this.btn_close.clickHandler = Laya.Handler.create(this, function () {
                            a.locking || a.close()
                        }, null, !1),
                        this.scrollbar = e.getChildByName("scrollbar").scriptMap["capsui.CScrollBar"],
                        this.scrollbar.init(new Laya.Handler(this, function (t) {
                            a._scale = 1 * (1 - t) + .5,
                                a.illust.scaleX = a._scale,
                                a.illust.scaleY = a._scale,
                                a.scrollbar.setVal(t, 0)
                        })),
                        this.dongtai_kaiguan = new t.UI_Dongtai_Kaiguan(this.me.getChildByName("dongtai"), new Laya.Handler(this, function () {
                            i.Inst.illust.resetSkin()
                        }), new Laya.Handler(this, function (t) {
                            i.Inst.illust.playAnim(t)
                        }))
                }
                return Object.defineProperty(e.prototype, "scale", {
                    get: function () {
                        return this._scale
                    },
                    set: function (t) {
                        this._scale = t,
                            this.scrollbar.setVal(1 - (t - .5) / 1, 0)
                    },
                    enumerable: !1,
                    configurable: !0
                }),
                    e.prototype.show = function (e) {
                        var n = this;
                        this.locking = !0,
                            this.when_close = e,
                            this.illust_start_x = this.illust.x,
                            this.illust_start_y = this.illust.y,
                            this.illust_center_x = this.illust.x + 984 - 446,
                            this.illust_center_y = this.illust.y + 11 - 84,
                            this.container_illust.getChildByName("container_name").visible = !1,
                            this.container_illust.getChildByName("container_name_en").visible = !1,
                            this.container_illust.getChildByName("btn").visible = !1,
                            i.Inst.stopsay(),
                            this.scale = 1,
                            Laya.Tween.to(this.illust, {
                                x: this.illust_center_x,
                                y: this.illust_center_y
                            }, 200),
                            t.UIBase.anim_pop_out(this.btn_big, null),
                            t.UIBase.anim_pop_out(this.btn_small, null),
                            t.UIBase.anim_pop_out(this.btn_close, null),
                            this.during_move = !1,
                            Laya.timer.once(250, this, function () {
                                n.locking = !1
                            }),
                            this.me.visible = !0,
                            this.dongtai_kaiguan.refresh(i.Inst.illust.skin_id)
                    },
                    e.prototype.close = function () {
                        var e = this;
                        this.locking = !0,
                            "chs" == GameMgr.client_language || "chs_t" == GameMgr.client_language ? this.container_illust.getChildByName("container_name").visible = !0 : this.container_illust.getChildByName("container_name_en").visible = !0,
                            this.container_illust.getChildByName("btn").visible = !0,
                            Laya.Tween.to(this.illust, {
                                x: this.illust_start_x,
                                y: this.illust_start_y,
                                scaleX: 1,
                                scaleY: 1
                            }, 200),
                            t.UIBase.anim_pop_hide(this.btn_big, null),
                            t.UIBase.anim_pop_hide(this.btn_small, null),
                            t.UIBase.anim_pop_hide(this.btn_close, null),
                            Laya.timer.once(250, this, function () {
                                e.locking = !1,
                                    e.me.visible = !1,
                                    e.when_close.run()
                            })
                    },
                    e.prototype.bigger = function () {
                        1.1 * this.scale > 1.5 ? this.scale = 1.5 : this.scale *= 1.1,
                            Laya.Tween.to(this.illust, {
                                scaleX: this.scale,
                                scaleY: this.scale
                            }, 100, null, null, 0, !0, !0)
                    },
                    e.prototype.smaller = function () {
                        this.scale / 1.1 < .5 ? this.scale = .5 : this.scale /= 1.1,
                            Laya.Tween.to(this.illust, {
                                scaleX: this.scale,
                                scaleY: this.scale
                            }, 100, null, null, 0, !0, !0)
                    },
                    e.prototype.move = function (t, e) {
                        var i = this.illust.x + t,
                            n = this.illust.y + e;
                        i < this.illust_center_x - 600 ? i = this.illust_center_x - 600 : i > this.illust_center_x + 600 && (i = this.illust_center_x + 600),
                            n < this.illust_center_y - 1200 ? n = this.illust_center_y - 1200 : n > this.illust_center_y + 800 && (n = this.illust_center_y + 800),
                            this.illust.x = i,
                            this.illust.y = n
                    },
                    e
            }
                (),
                i = function (i) {
                    function n() {
                        var t = i.call(this, new ui.lobby.susheUI) || this;
                        return t.contianer_illust = null,
                            t.illust = null,
                            t.container_name = null,
                            t.label_name = null,
                            t.label_cv = null,
                            t.container_page = null,
                            t.container_look_illust = null,
                            t.page_select_character = null,
                            t.page_visit_character = null,
                            t.origin_illust_x = 0,
                            t.chat_id = 0,
                            t.container_chat = null,
                            t._select_index = 0,
                            t.sound_channel = null,
                            t.chat_block = null,
                            t.illust_showing = !0,
                            n.Inst = t,
                            t
                    }
                    return __extends(n, i),
                        n.init = function (e) {
                            var i = this;
                            app.NetAgent.sendReq2Lobby("Lobby", "fetchCharacterInfo", {}, function (n, a) {
                                if (n || a.error)
                                    t.UIMgr.Inst.showNetReqError("fetchCharacterInfo", n, a);
                                else {
                                    if (app.Log.log("fetchCharacterInfo: " + JSON.stringify(a)), (a = JSON.parse(JSON.stringify(a))).main_character_id && a.characters) {
                                        //if (i.characters = [], a.characters)
                                        //    for (r = 0; r < a.characters.length; r++)
                                        //        i.characters.push(a.characters[r]);
                                        //if (i.skin_map = {}, a.skins)
                                        //    for (r = 0; r < a.skins.length; r++)
                                        //        i.skin_map[a.skins[r]] = 1;
                                        //i.main_character_id = a.main_character_id
                                        //人物初始化修改寮舍人物（皮肤好感额外表情）----fxxk
                                        i.characters = [];
                                        for (var j = 1; j <= cfg.item_definition.character['rows_'].length; j++) {
                                            var id = 200000 + j;
                                            var skin = 400001 + j * 100;
                                            i.characters.push({
                                                charid: id,
                                                level: 5,
                                                exp: 0,
                                                skin: skin,
                                                is_upgraded: 1,
                                                extra_emoji: ["10", "11", "12", "13", "14", "15", "16", "17", "888"]
                                            });
                                        }
                                        let skins = cfg.item_definition.skin['rows_'];
                                        for (let skinitem of skins) {
                                            uiscript.UI_Sushe.add_skin(skinitem['id']);
                                        }
                                        for (let skinitem in MMP.settings.characters) {
                                            uiscript.UI_Sushe.characters[skinitem].skin = MMP.settings.characters[skinitem];
                                        }

                                        i.main_character_id = MMP.settings.character;
                                        GameMgr.Inst.account_data.avatar_id = MMP.settings.characters[MMP.settings.character - 200001];
                                        uiscript.UI_Sushe.star_chars = MMP.settings.star_chars;

                                        // END
                                    } else
                                        i.characters = [], i.characters.push({
                                            charid: 200001,
                                            level: 0,
                                            exp: 0,
                                            views: [],
                                            skin: 400101,
                                            is_upgraded: !1,
                                            extra_emoji: [],
                                            rewarded_level: []
                                        }), i.characters.push({
                                            charid: 200002,
                                            level: 0,
                                            exp: 0,
                                            views: [],
                                            skin: 400201,
                                            is_upgraded: !1,
                                            extra_emoji: [],
                                            rewarded_level: []
                                        }), i.skin_map[400101] = 1, i.skin_map[400201] = 1, i.main_character_id = 200001;
                                    if (i.send_gift_count = 0, i.send_gift_limit = 0, a.send_gift_count && (i.send_gift_count = a.send_gift_count), a.send_gift_limit && (i.send_gift_limit = a.send_gift_limit), a.finished_endings)
                                        for (var r = 0; r < a.finished_endings.length; r++)
                                            i.finished_endings_map[a.finished_endings[r]] = 1;
                                    if (a.rewarded_endings)
                                        for (var r = 0; r < a.rewarded_endings.length; r++)
                                            i.rewarded_endings_map[a.rewarded_endings[r]] = 1;
                                    //  i.star_chars = [],
                                    //    a.character_sort && (i.star_chars = a.character_sort),
                                    e.run()
                                }
                            });
                            //app.NetAgent.sendReq2Lobby("Lobby", "fetchAllCommonViews", {}, function (e, n) {
                            //if (e || n.error)
                            //    t.UIMgr.Inst.showNetReqError("fetchAllCommonViews", e, n);
                            //else {
                            //
                            // i.using_commonview_index = n.use,
                            i.using_commonview_index = MMP.settings.using_commonview_index;
                            i.commonViewList = [[], [], [], [], [], [], [], []];
                            //var a = n.views;
                            //if (a)
                            //    for (var r = 0; r < a.length; r++) {
                            //        var s = a[r].values;
                            //        s && (i.commonViewList[a[r].index] = s)
                            //    }
                            i.commonViewList = MMP.settings.commonViewList;
                            GameMgr.Inst.account_data.title = MMP.settings.title;
                            GameMgr.Inst.load_mjp_view();
                            GameMgr.Inst.load_touming_mjp_view();
                            GameMgr.Inst.account_data.avatar_frame = getAvatar_id();
                            //}
                            //})
                        },
                        n.on_data_updata = function (e) {
                            if (e.character) {
                                var i = JSON.parse(JSON.stringify(e.character));
                                if (i.characters)
                                    for (var n = i.characters, a = 0; a < n.length; a++) {
                                        for (var r = !1, s = 0; s < this.characters.length; s++)
                                            if (this.characters[s].charid == n[a].charid) {
                                                this.characters[s] = n[a],
                                                    t.UI_Sushe_Visit.Inst && t.UI_Sushe_Visit.Inst.chara_info && t.UI_Sushe_Visit.Inst.chara_info.charid == this.characters[s].charid && (t.UI_Sushe_Visit.Inst.chara_info = this.characters[s]),
                                                    r = !0;
                                                break
                                            }
                                        r || this.characters.push(n[a])
                                    }
                                if (i.skins) {
                                    for (var o = i.skins, a = 0; a < o.length; a++)
                                        this.skin_map[o[a]] = 1;
                                    t.UI_Bag.Inst.on_skin_change()
                                }
                                if (i.finished_endings) {
                                    for (var l = i.finished_endings, a = 0; a < l.length; a++)
                                        this.finished_endings_map[l[a]] = 1;
                                    t.UI_Sushe_Visit.Inst
                                }
                                if (i.rewarded_endings) {
                                    for (var l = i.rewarded_endings, a = 0; a < l.length; a++)
                                        this.rewarded_endings_map[l[a]] = 1;
                                    t.UI_Sushe_Visit.Inst
                                }
                            }
                        },
                        n.chara_owned = function (t) {
                            for (var e = 0; e < this.characters.length; e++)
                                if (this.characters[e].charid == t)
                                    return !0;
                            return !1
                        },
                        n.skin_owned = function (t) {
                            return this.skin_map.hasOwnProperty(t.toString())
                        },
                        n.add_skin = function (t) {
                            this.skin_map[t] = 1
                        },
                        Object.defineProperty(n, "main_chara_info", {
                            get: function () {
                                for (var t = 0; t < this.characters.length; t++)
                                    if (this.characters[t].charid == this.main_character_id)
                                        return this.characters[t];
                                return null
                            },
                            enumerable: !1,
                            configurable: !0
                        }),
                        n.on_view_remove = function (t) {
                            for (var e = 0; e < this.commonViewList.length; e++)
                                for (var i = this.commonViewList[e], n = 0; n < i.length; n++)
                                    if (i[n].item_id == t) {
                                        i[n].item_id = game.GameUtility.get_view_default_item_id(i[n].slot);
                                        break
                                    }
                            var a = cfg.item_definition.item.get(t);
                            a.type == game.EView.head_frame && GameMgr.Inst.account_data.avatar_frame == t && (GameMgr.Inst.account_data.avatar_frame = game.GameUtility.get_view_default_item_id(game.EView.head_frame))
                        },
                        n.add_finish_ending = function (t) {
                            this.finished_endings_map[t] = 1
                        },
                        n.add_reward_ending = function (t) {
                            this.rewarded_endings_map[t] = 1
                        },
                        n.check_all_char_repoint = function () {
                            for (var t = 0; t < n.characters.length; t++)
                                if (this.check_char_redpoint(n.characters[t]))
                                    return !0;
                            return !1
                        },
                        n.check_char_redpoint = function (t) {
                            // 去除小红点
                            return 0;
                            // END
                            var e = cfg.spot.spot.getGroup(t.charid);
                            if (e)
                                for (var i = 0; i < e.length; i++) {
                                    var a = e[i];
                                    if (!(a.is_married && !t.is_upgraded || !a.is_married && t.level < a.level_limit) && 2 == a.type) {
                                        for (var r = !0, s = 0; s < a.jieju.length; s++)
                                            if (a.jieju[s] && n.finished_endings_map[a.jieju[s]]) {
                                                if (!n.rewarded_endings_map[a.jieju[s]])
                                                    return !0;
                                                r = !1
                                            }
                                        if (r)
                                            return !0
                                    }
                                }
                            return !1
                        },
                        n.is_char_star = function (t) {
                            return -1 != this.star_chars.indexOf(t)
                        },
                        n.change_char_star = function (t) {
                            var e = this.star_chars.indexOf(t);
                            -1 != e ? this.star_chars.splice(e, 1) : this.star_chars.push(t),
                                MMP.settings.star_chars = uiscript.UI_Sushe.star_chars,
                                MMP.saveSettings();
                            // 屏蔽网络请求
                            //    app.NetAgent.sendReq2Lobby("Lobby", "updateCharacterSort", {
                            //        sort: this.star_chars
                            //    }, function () { })
                            // END
                        },
                        Object.defineProperty(n.prototype, "select_index", {
                            get: function () {
                                return this._select_index
                            },
                            enumerable: !1,
                            configurable: !0
                        }),
                        n.prototype.reset_select_index = function () {
                            this._select_index = -1
                        },
                        n.prototype.onCreate = function () {
                            var i = this;
                            this.contianer_illust = this.me.getChildByName("illust"),
                                this.illust = new t.UI_Character_Skin(this.contianer_illust.getChildByName("illust").getChildByName("illust")),
                                this.container_chat = this.contianer_illust.getChildByName("chat"),
                                this.chat_block = new t.UI_Character_Chat(this.container_chat),
                                this.contianer_illust.getChildByName("btn").clickHandler = Laya.Handler.create(this, function () {
                                    if (!i.page_visit_character.me.visible || !i.page_visit_character.cannot_click_say)
                                        if (i.illust.onClick(), i.sound_channel)
                                            i.stopsay();
                                        else {
                                            if (!i.illust_showing)
                                                return;
                                            i.say("lobby_normal")
                                        }
                                }, null, !1),
                                this.container_name = null,
                                "chs" == GameMgr.client_language || "chs_t" == GameMgr.client_language ? (this.container_name = this.contianer_illust.getChildByName("container_name"), this.contianer_illust.getChildByName("container_name_en").visible = !1) : (this.container_name = this.contianer_illust.getChildByName("container_name_en"), this.contianer_illust.getChildByName("container_name").visible = !1),
                                this.label_name = this.container_name.getChildByName("label_name"),
                                this.label_cv = this.container_name.getChildByName("label_CV"),
                                this.origin_illust_x = this.contianer_illust.x,
                                this.container_page = this.me.getChildByName("container_page"),
                                this.page_select_character = new t.UI_Sushe_Select,
                                this.container_page.addChild(this.page_select_character.me),
                                this.page_visit_character = new t.UI_Sushe_Visit,
                                this.container_page.addChild(this.page_visit_character.me),
                                this.container_look_illust = new e(this.me.getChildByName("look_illust"), this.contianer_illust)
                        },
                        n.prototype.show = function (t) {
                            GameMgr.Inst.BehavioralStatistics(15),
                                game.Scene_Lobby.Inst.change_bg("indoor", !1),
                                this.enable = !0,
                                this.page_visit_character.me.visible = !1,
                                this.container_look_illust.me.visible = !1;
                            for (var e = 0, i = 0; i < n.characters.length; i++)
                                if (n.characters[i].charid == n.main_character_id) {
                                    e = i;
                                    break
                                }
                            0 == t ? (this.change_select(e), this.show_page_select()) : (this._select_index = -1, this.illust_showing = !1, this.contianer_illust.visible = !1, this.page_select_character.show(1))
                        },
                        n.prototype.starup_back = function () {
                            this.enable = !0,
                                this.change_select(this._select_index),
                                this.page_visit_character.show(n.characters[this._select_index], 0),
                                this.page_visit_character.show_levelup()
                        },
                        n.prototype.spot_back = function () {
                            this.enable = !0,
                                this.change_select(this._select_index),
                                this.page_visit_character.show(n.characters[this._select_index], 2)
                        },
                        n.prototype.go2Lobby = function () {
                            this.close(Laya.Handler.create(this, function () {
                                t.UIMgr.Inst.showLobby()
                            }))
                        },
                        n.prototype.close = function (e) {
                            var i = this;
                            this.illust_showing && t.UIBase.anim_alpha_out(this.contianer_illust, {
                                x: -30
                            }, 150, 0),
                                Laya.timer.once(150, this, function () {
                                    i.enable = !1,
                                        e && e.run()
                                })
                        },
                        n.prototype.onDisable = function () {
                            view.AudioMgr.refresh_music_volume(!1),
                                this.illust.clear(),
                                this.stopsay(),
                                this.container_look_illust.me.visible && this.container_look_illust.close()
                        },
                        n.prototype.hide_illust = function () {
                            var e = this;
                            this.illust_showing && (this.illust_showing = !1, t.UIBase.anim_alpha_out(this.contianer_illust, {
                                x: -30
                            }, 200, 0, Laya.Handler.create(this, function () {
                                e.contianer_illust.visible = !1
                            })))
                        },
                        n.prototype.open_illust = function () {
                            if (!this.illust_showing)
                                if (this.illust_showing = !0, this._select_index >= 0)
                                    this.contianer_illust.visible = !0, this.contianer_illust.alpha = 1, t.UIBase.anim_alpha_in(this.contianer_illust, {
                                        x: -30
                                    }, 200);
                                else {
                                    for (var e = 0, i = 0; i < n.characters.length; i++)
                                        if (n.characters[i].charid == n.main_character_id) {
                                            e = i;
                                            break
                                        }
                                    this.change_select(e)
                                }
                        },
                        n.prototype.show_page_select = function () {
                            this.page_select_character.show(0)
                        },
                        n.prototype.show_page_visit = function (t) {
                            void 0 === t && (t = 0),
                                this.page_visit_character.show(n.characters[this._select_index], t)
                        },
                        n.prototype.change_select = function (e) {

                            this._select_index = e,
                                this.illust.clear(),
                                this.illust_showing = !0;
                            var i = n.characters[e];
                            this.label_name.text = "chs" == GameMgr.client_language || "chs_t" == GameMgr.client_language ? cfg.item_definition.character.get(i.charid)["name_" + GameMgr.client_language].replace("-", "|") : cfg.item_definition.character.get(i.charid)["name_" + GameMgr.client_language],
                                "chs" == GameMgr.client_language && (this.label_name.font = -1 != n.chs_fengyu_name_lst.indexOf(i.charid) ? "fengyu" : "hanyi"),
                                this.label_cv.text = "chs" == GameMgr.client_language || "chs_t" == GameMgr.client_language ? "CV" + cfg.item_definition.character.get(i.charid)["desc_cv_" + GameMgr.client_language] : "CV:" + cfg.item_definition.character.get(i.charid)["desc_cv_" + GameMgr.client_language],
                                "chs" == GameMgr.client_language && (this.label_cv.font = -1 != n.chs_fengyu_cv_lst.indexOf(i.charid) ? "fengyu" : "hanyi"),
                                this.illust.setSkin(i.skin, "full"),
                                this.contianer_illust.visible = !0,
                                Laya.Tween.clearAll(this.contianer_illust),
                                this.contianer_illust.x = this.origin_illust_x,
                                this.contianer_illust.alpha = 1,
                                t.UIBase.anim_alpha_in(this.contianer_illust, {
                                    x: -30
                                }, 230),
                                this.stopsay();
                            var a = cfg.item_definition.skin.get(i.skin);
                            a.spine_type ? (this.page_select_character.changeKaiguanShow(!0), this.container_look_illust.dongtai_kaiguan.show(this.illust.skin_id)) : (this.page_select_character.changeKaiguanShow(!1), this.container_look_illust.dongtai_kaiguan.hide())
                        },
                        n.prototype.onChangeSkin = function (t) {
                            n.characters[this._select_index].skin = t,
                                this.change_select(this._select_index),
                                n.characters[this._select_index].charid == n.main_character_id && (GameMgr.Inst.account_data.avatar_id = t)
                            // 屏蔽换肤请求
                            //app.NetAgent.sendReq2Lobby("Lobby", "changeCharacterSkin", {
                            //    character_id: n.characters[this._select_index].charid,
                            //    skin: t
                            //}, function () { })
                            // 保存皮肤
                            MMP.settings.characters[this._select_index] = t;
                            MMP.saveSettings();
                            // END
                        },
                        n.prototype.say = function (t) {
                            var e = this,
                                i = n.characters[this._select_index];
                            this.chat_id++;
                            var a = this.chat_id,
                                r = view.AudioMgr.PlayCharactorSound(i, t, Laya.Handler.create(this, function () {
                                    Laya.timer.once(1e3, e, function () {
                                        a == e.chat_id && e.stopsay()
                                    })
                                }));
                            r && (this.chat_block.show(r.words), this.sound_channel = r.sound)
                        },
                        n.prototype.stopsay = function () {
                            this.chat_block.close(!1),
                                this.sound_channel && (this.sound_channel.stop(), Laya.SoundManager.removeChannel(this.sound_channel), this.sound_channel = null)
                        },
                        n.prototype.to_look_illust = function () {
                            var t = this;
                            this.container_look_illust.show(Laya.Handler.create(this, function () {
                                t.illust.playAnim("idle"),
                                    t.page_select_character.show(0)
                            }))
                        },
                        n.prototype.jump_to_char_skin = function (e) {
                            var i = this;
                            if (void 0 === e && (e = -1), e >= 0)
                                for (var a = 0; a < n.characters.length; a++)
                                    if (n.characters[a].charid == e) {
                                        this.change_select(a);
                                        break
                                    }
                            t.UI_Sushe_Select.Inst.close(Laya.Handler.create(this, function () {
                                n.Inst.show_page_visit(),
                                    i.page_visit_character.show_pop_skin()
                            }))
                        },
                        n.prototype.jump_to_char_qiyue = function (e) {
                            var i = this;
                            if (void 0 === e && (e = -1), e >= 0)
                                for (var a = 0; a < n.characters.length; a++)
                                    if (n.characters[a].charid == e) {
                                        this.change_select(a);
                                        break
                                    }
                            t.UI_Sushe_Select.Inst.close(Laya.Handler.create(this, function () {
                                n.Inst.show_page_visit(),
                                    i.page_visit_character.show_qiyue()
                            }))
                        },
                        n.characters = [],
                        n.chs_fengyu_name_lst = [200040, 200043],
                        n.chs_fengyu_cv_lst = [200047, 200050, 200054],
                        n.skin_map = {},
                        n.main_character_id = 0,
                        n.send_gift_count = 0,
                        n.send_gift_limit = 0,
                        n.commonViewList = [],
                        n.using_commonview_index = 0,
                        n.finished_endings_map = {},
                        n.rewarded_endings_map = {},
                        n.star_chars = [],
                        n.Inst = null,
                        n
                }
                    (t.UIBase);
            t.UI_Sushe = i
        }
            (uiscript || (uiscript = {}));



        // 屏蔽改变宿舍角色的网络请求
        !function (t) {
            var e = function () {
                function e(e) {
                    var n = this;
                    this.scrollview = null,
                        this.select_index = 0,
                        this.show_index_list = [],
                        this.only_show_star_char = !1,
                        this.me = e,
                        this.me.getChildByName("btn_visit").clickHandler = Laya.Handler.create(this, function () {
                            i.Inst.locking || i.Inst.close(Laya.Handler.create(n, function () {
                                t.UI_Sushe.Inst.show_page_visit()
                            }))
                        }, null, !1),
                        this.me.getChildByName("btn_look").clickHandler = Laya.Handler.create(this, function () {
                            i.Inst.locking || i.Inst.close(Laya.Handler.create(n, function () {
                                t.UI_Sushe.Inst.to_look_illust()
                            }))
                        }, null, !1),
                        this.me.getChildByName("btn_huanzhuang").clickHandler = Laya.Handler.create(this, function () {
                            i.Inst.locking || t.UI_Sushe.Inst.jump_to_char_skin()
                        }, null, !1),
                        this.me.getChildByName("btn_star").clickHandler = Laya.Handler.create(this, function () {
                            i.Inst.locking || n.onChangeStarShowBtnClick()
                        }, null, !1),
                        this.scrollview = this.me.scriptMap["capsui.CScrollView"],
                        this.scrollview.init_scrollview(new Laya.Handler(this, this.render_character_cell), -1, 3),
                        this.scrollview.setElastic(),
                        this.dongtai_kaiguan = new t.UI_Dongtai_Kaiguan(this.me.getChildByName("dongtai"), new Laya.Handler(this, function () {
                            t.UI_Sushe.Inst.illust.resetSkin()
                        }))
                }
                return e.prototype.show = function (e, i) {
                    void 0 === i && (i = !1),
                        this.me.visible = !0,
                        e ? this.me.alpha = 1 : t.UIBase.anim_alpha_in(this.me, {
                            x: 0
                        }, 200, 0),
                        this.getShowStarState(),
                        this.sortShowCharsList(),
                        i || (this.me.getChildByName("btn_star").getChildAt(1).x = this.only_show_star_char ? 107 : 47),
                        this.scrollview.reset(),
                        this.scrollview.addItem(this.show_index_list.length)
                },
                    e.prototype.render_character_cell = function (e) {
                        var i = this,
                            n = e.index,
                            a = e.container,
                            r = e.cache_data;
                        a.visible = !0,
                            r.index = n,
                            r.inited || (r.inited = !0, a.getChildByName("btn").clickHandler = new Laya.Handler(this, function () {
                                i.onClickAtHead(r.index)
                            }), r.skin = new t.UI_Character_Skin(a.getChildByName("btn").getChildByName("head")), r.bg = a.getChildByName("btn").getChildByName("bg"), r.bound = a.getChildByName("btn").getChildByName("bound"), r.btn_star = a.getChildByName("btn_star"), r.star = a.getChildByName("btn").getChildByName("star"), r.btn_star.clickHandler = new Laya.Handler(this, function () {
                                i.onClickAtStar(r.index)
                            }));
                        var s = a.getChildByName("btn");
                        s.getChildByName("choose").visible = n == this.select_index;
                        var o = this.getCharInfoByIndex(n);
                        s.getChildByName("redpoint").visible = t.UI_Sushe.check_char_redpoint(o),
                            r.skin.setSkin(o.skin, "bighead"),
                            s.getChildByName("using").visible = o.charid == t.UI_Sushe.main_character_id,
                            a.getChildByName("btn").getChildByName("bg").skin = game.Tools.localUISrc("myres/sushe/bg_head" + (o.is_upgraded ? "2.png" : ".png"));
                        var l = cfg.item_definition.character.get(o.charid);
                        "en" == GameMgr.client_language || "jp" == GameMgr.client_language ? r.bound.skin = l.ur ? game.Tools.localUISrc("myres/sushe/bg_head_bound" + (o.is_upgraded ? "4.png" : "3.png")) : game.Tools.localUISrc("myres/sushe/en_head_bound" + (o.is_upgraded ? "2.png" : ".png")) : l.ur ? (r.bound.pos(-10, -2), r.bound.skin = game.Tools.localUISrc("myres/sushe/bg_head" + (o.is_upgraded ? "6.png" : "5.png"))) : (r.bound.pos(4, 20), r.bound.skin = game.Tools.localUISrc("myres/sushe/bg_head" + (o.is_upgraded ? "4.png" : "3.png"))),
                            r.btn_star.visible = this.select_index == n,
                            r.star.visible = t.UI_Sushe.is_char_star(o.charid) || this.select_index == n,
                            "chs" == GameMgr.client_language || "chs_t" == GameMgr.client_language ? (r.star.skin = game.Tools.localUISrc("myres/sushe/tag_star_" + (t.UI_Sushe.is_char_star(o.charid) ? "l" : "d") + (o.is_upgraded ? "1.png" : ".png")), s.getChildByName("label_name").text = cfg.item_definition.character.find(o.charid)["name_" + GameMgr.client_language].replace("-", "|")) : (r.star.skin = game.Tools.localUISrc("myres/sushe/tag_star_" + (t.UI_Sushe.is_char_star(o.charid) ? "l.png" : "d.png")), s.getChildByName("label_name").text = cfg.item_definition.character.find(o.charid)["name_" + GameMgr.client_language]),
                            ("chs" == GameMgr.client_language || "chs_t" == GameMgr.client_language) && (200041 == o.charid ? (s.getChildByName("label_name").scaleX = .67, s.getChildByName("label_name").scaleY = .57) : (s.getChildByName("label_name").scaleX = .7, s.getChildByName("label_name").scaleY = .6))
                    },
                    e.prototype.onClickAtHead = function (e) {
                        if (this.select_index == e) {
                            var i = this.getCharInfoByIndex(e);
                            if (i.charid != t.UI_Sushe.main_character_id)
                                if (t.UI_PiPeiYuYue.Inst.enable)
                                    t.UIMgr.Inst.ShowErrorInfo(game.Tools.strOfLocalization(2769));
                                else {
                                    var n = t.UI_Sushe.main_character_id;
                                    t.UI_Sushe.main_character_id = i.charid,
                                        // app.NetAgent.sendReq2Lobby("Lobby", "changeMainCharacter", {
                                        //    character_id: t.UI_Sushe.main_character_id
                                        // }, function (t, e) {}),
                                        GameMgr.Inst.account_data.avatar_id = i.skin;
                                    // 保存人物和皮肤
                                    MMP.settings.character = i.charid;
                                    MMP.settings.characters[MMP.settings.character - 200001] = i.skin;
                                    MMP.saveSettings();
                                    // END
                                    for (var a = 0; a < this.show_index_list.length; a++)
                                        this.getCharInfoByIndex(a).charid == n && this.scrollview.wantToRefreshItem(a);
                                    this.scrollview.wantToRefreshItem(e)
                                }
                        } else {
                            var r = this.select_index;
                            this.select_index = e,
                                r >= 0 && this.scrollview.wantToRefreshItem(r),
                                this.scrollview.wantToRefreshItem(e),
                                t.UI_Sushe.Inst.change_select(this.show_index_list[e])

                        }
                    },
                    e.prototype.onClickAtStar = function (e) {
                        if (t.UI_Sushe.change_char_star(this.getCharInfoByIndex(e).charid), this.only_show_star_char)
                            this.scrollview.wantToRefreshItem(e);
                        else if (this.show(!0), Math.floor(this.show_index_list.length / 3) - 3 > 0) {
                            var i = (Math.floor(this.select_index / 3) - 1) / (Math.floor(this.show_index_list.length / 3) - 3);
                            this.scrollview.rate = Math.min(1, Math.max(0, i))
                        }
                        // 保存人物和皮肤
                        MMP.settings.star_chars = uiscript.UI_Sushe.star_chars;
                        MMP.saveSettings();
                        // END
                    },
                    e.prototype.close = function (e) {
                        var i = this;
                        this.me.visible && (e ? this.me.visible = !1 : t.UIBase.anim_alpha_out(this.me, {
                            x: 0
                        }, 200, 0, Laya.Handler.create(this, function () {
                            i.me.visible = !1
                        })))
                    },
                    e.prototype.onChangeStarShowBtnClick = function () {
                        if (0 == t.UI_Sushe.star_chars.length && !this.only_show_star_char)
                            return t.UI_SecondConfirm.Inst.show_only_confirm(game.Tools.strOfLocalization(3301)), void 0;
                        t.UI_Sushe.Inst.change_select(this.show_index_list.length > 0 ? this.show_index_list[0] : 0),
                            this.only_show_star_char = !this.only_show_star_char,
                            Laya.LocalStorage.setItem("onlyShowStar", this.only_show_star_char ? "1" : "0");
                        var e = this.me.getChildByName("btn_star").getChildAt(1);
                        Laya.Tween.clearAll(e),
                            Laya.Tween.to(e, {
                                x: this.only_show_star_char ? 107 : 47
                            }, 150),
                            this.show(!0, !0)
                    },
                    e.prototype.getShowStarState = function () {
                        return 0 == t.UI_Sushe.star_chars.length ? (this.only_show_star_char = !1, void 0) : (this.only_show_star_char = "1" == Laya.LocalStorage.getItem("onlyShowStar"), void 0)
                    },
                    e.prototype.sortShowCharsList = function () {
                        this.show_index_list = [],
                            this.select_index = -1;
                        for (var e = 0, i = t.UI_Sushe.star_chars; e < i.length; e++)
                            for (var n = i[e], a = 0; a < t.UI_Sushe.characters.length; a++)
                                if (t.UI_Sushe.characters[a].charid == n) {
                                    a == t.UI_Sushe.Inst.select_index && (this.select_index = this.show_index_list.length),
                                        this.show_index_list.push(a);
                                    break
                                }
                        if (!this.only_show_star_char)
                            for (var a = 0; a < t.UI_Sushe.characters.length; a++)
                                - 1 == this.show_index_list.indexOf(a) && (a == t.UI_Sushe.Inst.select_index && (this.select_index = this.show_index_list.length), this.show_index_list.push(a))
                    },
                    e.prototype.getCharInfoByIndex = function (e) {
                        return t.UI_Sushe.characters[this.show_index_list[e]]
                    },
                    e
            }
                (),
                i = function (i) {
                    function n() {
                        var t = i.call(this, "chs" == GameMgr.client_language || "chs_t" == GameMgr.client_language ? new ui.lobby.sushe_selectUI : new ui.lobby.sushe_select_enUI) || this;
                        return t.bg_width_head = 962,
                            t.bg_width_zhuangban = 1819,
                            t.bg2_delta = -29,
                            t.container_top = null,
                            t.locking = !1,
                            t.tabs = [],
                            t.tab_index = 0,
                            n.Inst = t,
                            t
                    }
                    return __extends(n, i),
                        n.prototype.onCreate = function () {
                            var i = this;
                            this.container_top = this.me.getChildByName("top"),
                                this.container_top.getChildByName("btn_back").clickHandler = Laya.Handler.create(this, function () {
                                    i.locking || (1 == i.tab_index && i.container_zhuangban.changed ? t.UI_SecondConfirm.Inst.show(game.Tools.strOfLocalization(3022), Laya.Handler.create(i, function () {
                                        i.close(),
                                            t.UI_Sushe.Inst.go2Lobby()
                                    }), null) : (i.close(), t.UI_Sushe.Inst.go2Lobby()))
                                }, null, !1),
                                this.root = this.me.getChildByName("root"),
                                this.bg2 = this.root.getChildByName("bg2"),
                                this.bg = this.root.getChildByName("bg");
                            for (var n = this.root.getChildByName("container_tabs"), a = function (e) {
                                r.tabs.push(n.getChildAt(e)),
                                    r.tabs[e].clickHandler = new Laya.Handler(r, function () {
                                        i.locking || i.tab_index != e && (1 == i.tab_index && i.container_zhuangban.changed ? t.UI_SecondConfirm.Inst.show(game.Tools.strOfLocalization(3022), Laya.Handler.create(i, function () {
                                            i.change_tab(e)
                                        }), null) : i.change_tab(e))
                                    })
                            }, r = this, s = 0; s < n.numChildren; s++)
                                a(s);
                            this.container_head = new e(this.root.getChildByName("container_heads")),
                                this.container_zhuangban = new t.zhuangban.Container_Zhuangban(this.root.getChildByName("container_zhuangban0"), this.root.getChildByName("container_zhuangban1"), new Laya.Handler(this, function () {
                                    return i.locking
                                }))
                        },
                        n.prototype.show = function (e) {
                            var i = this;
                            this.enable = !0,
                                this.locking = !0,
                                this.container_head.dongtai_kaiguan.refresh(),
                                this.tab_index = e,
                                0 == this.tab_index ? (this.bg.width = this.bg_width_head, this.bg2.width = this.bg.width + this.bg2_delta, this.container_zhuangban.close(!0), this.container_head.show(!0), t.UIBase.anim_alpha_in(this.container_top, {
                                    y: -30
                                }, 200), t.UIBase.anim_alpha_in(this.root, {
                                    x: 30
                                }, 200)) : (this.bg.width = this.bg_width_zhuangban, this.bg2.width = this.bg.width + this.bg2_delta, this.container_zhuangban.show(!0), this.container_head.close(!0), t.UIBase.anim_alpha_in(this.container_top, {
                                    y: -30
                                }, 200), t.UIBase.anim_alpha_in(this.root, {
                                    y: 30
                                }, 200)),
                                Laya.timer.once(200, this, function () {
                                    i.locking = !1
                                });
                            for (var n = 0; n < this.tabs.length; n++) {
                                var a = this.tabs[n];
                                a.skin = game.Tools.localUISrc(n == this.tab_index ? "myres/sushe/btn_shine2.png" : "myres/sushe/btn_dark2.png");
                                var r = a.getChildByName("word");
                                r.color = n == this.tab_index ? "#552c1c" : "#d3a86c",
                                    r.scaleX = r.scaleY = n == this.tab_index ? 1.1 : 1,
                                    n == this.tab_index && a.parent.setChildIndex(a, this.tabs.length - 1)
                            }
                        },
                        n.prototype.change_tab = function (e) {
                            var i = this;
                            this.tab_index = e;
                            for (var n = 0; n < this.tabs.length; n++) {
                                var a = this.tabs[n];
                                a.skin = game.Tools.localUISrc(n == e ? "myres/sushe/btn_shine2.png" : "myres/sushe/btn_dark2.png");
                                var r = a.getChildByName("word");
                                r.color = n == e ? "#552c1c" : "#d3a86c",
                                    r.scaleX = r.scaleY = n == e ? 1.1 : 1,
                                    n == e && a.parent.setChildIndex(a, this.tabs.length - 1)
                            }
                            this.locking = !0,
                                0 == this.tab_index ? (this.container_zhuangban.close(!1), Laya.Tween.to(this.bg, {
                                    width: this.bg_width_head
                                }, 200, Laya.Ease.strongOut, Laya.Handler.create(this, function () {
                                    t.UI_Sushe.Inst.open_illust(),
                                        i.container_head.show(!1)
                                })), Laya.Tween.to(this.bg2, {
                                    width: this.bg_width_head + this.bg2_delta
                                }, 200, Laya.Ease.strongOut)) : 1 == this.tab_index && (this.container_head.close(!1), t.UI_Sushe.Inst.hide_illust(), Laya.Tween.to(this.bg, {
                                    width: this.bg_width_zhuangban
                                }, 200, Laya.Ease.strongOut, Laya.Handler.create(this, function () {
                                    i.container_zhuangban.show(!1)
                                })), Laya.Tween.to(this.bg2, {
                                    width: this.bg_width_zhuangban + this.bg2_delta
                                }, 200, Laya.Ease.strongOut)),
                                Laya.timer.once(400, this, function () {
                                    i.locking = !1
                                })
                        },
                        n.prototype.close = function (e) {
                            var i = this;
                            this.locking = !0,
                                t.UIBase.anim_alpha_out(this.container_top, {
                                    y: -30
                                }, 150),
                                0 == this.tab_index ? t.UIBase.anim_alpha_out(this.root, {
                                    x: 30
                                }, 150, 0, Laya.Handler.create(this, function () {
                                    i.container_head.close(!0)
                                })) : t.UIBase.anim_alpha_out(this.root, {
                                    y: 30
                                }, 150, 0, Laya.Handler.create(this, function () {
                                    i.container_zhuangban.close(!0)
                                })),
                                Laya.timer.once(150, this, function () {
                                    i.locking = !1,
                                        i.enable = !1,
                                        e && e.run()
                                })
                        },
                        n.prototype.onDisable = function () {
                            for (var e = 0; e < t.UI_Sushe.characters.length; e++) {
                                var i = t.UI_Sushe.characters[e].skin,
                                    n = cfg.item_definition.skin.get(i);
                                n && Laya.loader.clearTextureRes(game.LoadMgr.getResImageSkin(n.path + "/bighead.png"))
                            }
                        },
                        n.prototype.changeKaiguanShow = function (t) {
                            t ? this.container_head.dongtai_kaiguan.show() : this.container_head.dongtai_kaiguan.hide()
                        },
                        n
                }
                    (t.UIBase);
            t.UI_Sushe_Select = i
        }
            (uiscript || (uiscript = {}));



        // 友人房
        !function (t) {
            var e = function () {
                function e(t) {
                    var e = this;
                    this.friends = [],
                        this.sortlist = [],
                        this.me = t,
                        this.me.visible = !1,
                        this.blackbg = t.getChildByName("blackbg"),
                        this.blackbg.clickHandler = Laya.Handler.create(this, function () {
                            e.locking || e.close()
                        }, null, !1),
                        this.root = t.getChildByName("root"),
                        this.scrollview = this.root.scriptMap["capsui.CScrollView"],
                        this.scrollview.init_scrollview(Laya.Handler.create(this, this.render_item, null, !1)),
                        this.noinfo = this.root.getChildByName("noinfo")
                }
                return e.prototype.show = function () {
                    var e = this;
                    this.locking = !0,
                        this.me.visible = !0,
                        this.scrollview.reset(),
                        this.friends = [],
                        this.sortlist = [];
                    for (var i = game.FriendMgr.friend_list, n = 0; n < i.length; n++)
                        this.sortlist.push(n);
                    this.sortlist = this.sortlist.sort(function (t, e) {
                        var n = i[t],
                            a = 0;
                        if (n.state.is_online) {
                            var r = game.Tools.playState2Desc(n.state.playing);
                            a += "" != r ? 3e10 : 6e10,
                                a += n.base.level.id % 1e3 * 1e7,
                                a += n.base.level3.id % 1e3 * 1e4,
                                a += -Math.floor(n.state.login_time / 1e7)
                        } else
                            a += n.state.logout_time;
                        var s = i[e],
                            o = 0;
                        if (s.state.is_online) {
                            var r = game.Tools.playState2Desc(s.state.playing);
                            o += "" != r ? 3e10 : 6e10,
                                o += s.base.level.id % 1e3 * 1e7,
                                o += s.base.level3.id % 1e3 * 1e4,
                                o += -Math.floor(s.state.login_time / 1e7)
                        } else
                            o += s.state.logout_time;
                        return o - a
                    });
                    for (var n = 0; n < i.length; n++)
                        this.friends.push({
                            f: i[n],
                            invited: !1
                        });
                    this.noinfo.visible = 0 == this.friends.length,
                        this.scrollview.addItem(this.friends.length),
                        t.UIBase.anim_pop_out(this.root, Laya.Handler.create(this, function () {
                            e.locking = !1
                        }))
                },
                    e.prototype.close = function () {
                        var e = this;
                        this.locking = !0,
                            t.UIBase.anim_pop_hide(this.root, Laya.Handler.create(this, function () {
                                e.locking = !1,
                                    e.me.visible = !1
                            }))
                    },
                    e.prototype.render_item = function (e) {
                        var i = e.index,
                            n = e.container,
                            r = e.cache_data;
                        r.head || (r.head = new t.UI_Head(n.getChildByName("head"), "UI_WaitingRoom"), r.name = n.getChildByName("name"), r.state = n.getChildByName("label_state"), r.btn = n.getChildByName("btn_invite"), r.invited = n.getChildByName("invited"));
                        var s = this.friends[this.sortlist[i]];
                        r.head.id = game.GameUtility.get_limited_skin_id(s.f.base.avatar_id),
                            r.head.set_head_frame(s.f.base.account_id, s.f.base.avatar_frame),
                            game.Tools.SetNickname(r.name, s.f.base);
                        var o = !1;
                        if (s.f.state.is_online) {
                            var l = game.Tools.playState2Desc(s.f.state.playing);
                            "" != l ? (r.state.text = game.Tools.strOfLocalization(2069, [l]), r.state.color = "#a9d94d", r.name.color = "#a9d94d") : (r.state.text = game.Tools.strOfLocalization(2071), r.state.color = "#58c4db", r.name.color = "#58c4db", o = !0)
                        } else
                            r.state.text = game.Tools.strOfLocalization(2072), r.state.color = "#8c8c8c", r.name.color = "#8c8c8c";
                        s.invited ? (r.btn.visible = !1, r.invited.visible = !0) : (r.btn.visible = !0, r.invited.visible = !1, game.Tools.setGrayDisable(r.btn, !o), o && (r.btn.clickHandler = Laya.Handler.create(this, function () {
                            game.Tools.setGrayDisable(r.btn, !0);
                            var e = {
                                room_id: a.Inst.room_id,
                                mode: a.Inst.room_mode,
                                nickname: GameMgr.Inst.account_data.nickname,
                                verified: GameMgr.Inst.account_data.verified,
                                account_id: GameMgr.Inst.account_id
                            };
                            app.NetAgent.sendReq2Lobby("Lobby", "sendClientMessage", {
                                target_id: s.f.base.account_id,
                                type: game.EFriendMsgType.room_invite,
                                content: JSON.stringify(e)
                            }, function (e, i) {
                                e || i.error ? (game.Tools.setGrayDisable(r.btn, !1), t.UIMgr.Inst.showNetReqError("sendClientMessage", e, i)) : (r.btn.visible = !1, r.invited.visible = !0, s.invited = !0)
                            })
                        }, null, !1)))
                    },
                    e
            }
                (),
                i = function () {
                    function e(e) {
                        var i = this;
                        this.tabs = [],
                            this.tab_index = 0,
                            this.me = e,
                            this.blackmask = this.me.getChildByName("blackmask"),
                            this.root = this.me.getChildByName("root"),
                            this.page_head = new t.zhuangban.Page_Waiting_Head(this.root.getChildByName("container_heads")),
                            this.page_zhangban = new t.zhuangban.Container_Zhuangban(this.root.getChildByName("container_zhuangban0"), this.root.getChildByName("container_zhuangban1"), new Laya.Handler(this, function () {
                                return i.locking
                            }));
                        for (var n = this.root.getChildByName("container_tabs"), a = function (e) {
                            r.tabs.push(n.getChildAt(e)),
                                r.tabs[e].clickHandler = new Laya.Handler(r, function () {
                                    i.locking || i.tab_index != e && (1 == i.tab_index && i.page_zhangban.changed ? t.UI_SecondConfirm.Inst.show(game.Tools.strOfLocalization(3022), Laya.Handler.create(i, function () {
                                        i.change_tab(e)
                                    }), null) : i.change_tab(e))
                                })
                        }, r = this, s = 0; s < n.numChildren; s++)
                            a(s);
                        this.root.getChildByName("close").clickHandler = new Laya.Handler(this, function () {
                            i.locking || (1 == i.tab_index && i.page_zhangban.changed ? t.UI_SecondConfirm.Inst.show(game.Tools.strOfLocalization(3022), Laya.Handler.create(i, function () {
                                i.close(!1)
                            }), null) : i.close(!1))
                        }),
                            this.root.getChildByName("btn_close").clickHandler = new Laya.Handler(this, function () {
                                i.locking || (1 == i.tab_index && i.page_zhangban.changed ? t.UI_SecondConfirm.Inst.show(game.Tools.strOfLocalization(3022), Laya.Handler.create(i, function () {
                                    i.close(!1)
                                }), null) : i.close(!1))
                            })
                    }
                    return e.prototype.show = function () {
                        var e = this;
                        this.me.visible = !0,
                            this.blackmask.alpha = 0,
                            this.locking = !0,
                            Laya.Tween.to(this.blackmask, {
                                alpha: .3
                            }, 150),
                            t.UIBase.anim_pop_out(this.root, Laya.Handler.create(this, function () {
                                e.locking = !1
                            })),
                            this.tab_index = 0,
                            this.page_zhangban.close(!0),
                            this.page_head.show(!0);
                        for (var i = 0; i < this.tabs.length; i++) {
                            var n = this.tabs[i];
                            n.skin = game.Tools.localUISrc(i == this.tab_index ? "myres/sushe/btn_shine2.png" : "myres/sushe/btn_dark2.png");
                            var a = n.getChildByName("word");
                            a.color = i == this.tab_index ? "#552c1c" : "#d3a86c",
                                a.scaleX = a.scaleY = i == this.tab_index ? 1.1 : 1,
                                i == this.tab_index && n.parent.setChildIndex(n, this.tabs.length - 1)
                        }
                    },
                        e.prototype.change_tab = function (t) {
                            var e = this;
                            this.tab_index = t;
                            for (var i = 0; i < this.tabs.length; i++) {
                                var n = this.tabs[i];
                                n.skin = game.Tools.localUISrc(i == t ? "myres/sushe/btn_shine2.png" : "myres/sushe/btn_dark2.png");
                                var a = n.getChildByName("word");
                                a.color = i == t ? "#552c1c" : "#d3a86c",
                                    a.scaleX = a.scaleY = i == t ? 1.1 : 1,
                                    i == t && n.parent.setChildIndex(n, this.tabs.length - 1)
                            }
                            this.locking = !0,
                                0 == this.tab_index ? (this.page_zhangban.close(!1), Laya.timer.once(200, this, function () {
                                    e.page_head.show(!1)
                                })) : 1 == this.tab_index && (this.page_head.close(!1), Laya.timer.once(200, this, function () {
                                    e.page_zhangban.show(!1)
                                })),
                                Laya.timer.once(400, this, function () {
                                    e.locking = !1
                                })
                        },
                        e.prototype.close = function (e) {
                            var i = this;
                            //修改友人房间立绘
                            if (!(i.page_head.choosed_chara_index == 0 && i.page_head.choosed_skin_id == 0)) {
                                for (let id = 0; id < a.Inst.players.length; id++) {
                                    if (a.Inst.players[id].account_id == GameMgr.Inst.account_id) {
                                        a.Inst.players[id].avatar_id = i.page_head.choosed_skin_id;
                                        GameMgr.Inst.account_data.avatar_id = i.page_head.choosed_skin_id;
                                        uiscript.UI_Sushe.main_character_id = i.page_head.choosed_chara_index + 200001;
                                        uiscript.UI_WaitingRoom.Inst._refreshPlayerInfo(uiscript.UI_WaitingRoom.Inst.players[id]);
                                        MMP.settings.characters[i.page_head.choosed_chara_index] = i.page_head.choosed_skin_id;
                                        MMP.saveSettings();
                                        break;
                                    }
                                }
                            }
                            //end
                            this.me.visible && (e ? (this.page_head.close(!0), this.page_zhangban.close(!0), this.me.visible = !1) : (app.NetAgent.sendReq2Lobby("Lobby", "readyPlay", {
                                ready: a.Inst.owner_id == GameMgr.Inst.account_id ? !0 : !1,
                                dressing: !1
                            }, function () { }), this.locking = !0, this.page_head.close(!1), this.page_zhangban.close(!1), t.UIBase.anim_pop_hide(this.root, Laya.Handler.create(this, function () {
                                i.locking = !1,
                                    i.me.visible = !1
                            }))))
                        },
                        e
                }
                    (),
                n = function () {
                    function t(t) {
                        this.modes = [],
                            this.me = t,
                            this.bg = this.me.getChildByName("bg"),
                            this.scrollview = this.me.scriptMap["capsui.CScrollView"],
                            this.scrollview.init_scrollview(new Laya.Handler(this, this.render_item))
                    }
                    return t.prototype.show = function (t) {
                        this.me.visible = !0,
                            this.scrollview.reset(),
                            this.modes = t,
                            this.scrollview.addItem(t.length);
                        var e = this.scrollview.total_height;
                        e > 380 ? (this.scrollview._content.y = 10, this.bg.height = 400) : (this.scrollview._content.y = 390 - e, this.bg.height = e + 20),
                            this.bg.visible = !0
                    },
                        t.prototype.render_item = function (t) {
                            var e = t.index,
                                i = t.container,
                                n = i.getChildByName("info");
                            n.fontSize = 40,
                                n.fontSize = this.modes[e].length <= 5 ? 40 : this.modes[e].length <= 9 ? 55 - 3 * this.modes[e].length : 28,
                                n.text = this.modes[e]
                        },
                        t
                }
                    (),
                a = function (a) {
                    function r() {
                        var e = a.call(this, new ui.lobby.waitingroomUI) || this;
                        return e.skin_ready = "myres/room/btn_ready.png",
                            e.skin_cancel = "myres/room/btn_cancel.png",
                            e.skin_start = "myres/room/btn_start.png",
                            e.skin_start_no = "myres/room/btn_start_no.png",
                            e.update_seq = 0,
                            e.pre_msgs = [],
                            e.msg_tail = -1,
                            e.posted = !1,
                            e.label_rommid = null,
                            e.player_cells = [],
                            e.btn_ok = null,
                            e.btn_invite_friend = null,
                            e.btn_add_robot = null,
                            e.btn_dress = null,
                            e.beReady = !1,
                            e.room_id = -1,
                            e.owner_id = -1,
                            e.tournament_id = 0,
                            e.max_player_count = 0,
                            e.players = [],
                            e.container_rules = null,
                            e.container_top = null,
                            e.container_right = null,
                            e.locking = !1,
                            e.mousein_copy = !1,
                            e.popout = null,
                            e.room_link = null,
                            e.btn_copy_link = null,
                            e.last_start_room = 0,
                            e.invitefriend = null,
                            e.pre_choose = null,
                            e.ai_name = game.Tools.strOfLocalization(2003),
                            r.Inst = e,
                            app.NetAgent.AddListener2Lobby("NotifyRoomPlayerReady", Laya.Handler.create(e, function (t) {
                                app.Log.log("NotifyRoomPlayerReady:" + JSON.stringify(t)),
                                    e.onReadyChange(t.account_id, t.ready, t.dressing)
                            })),
                            app.NetAgent.AddListener2Lobby("NotifyRoomPlayerUpdate", Laya.Handler.create(e, function (t) {
                                app.Log.log("NotifyRoomPlayerUpdate:" + JSON.stringify(t)),
                                    e.onPlayerChange(t)
                            })),
                            app.NetAgent.AddListener2Lobby("NotifyRoomGameStart", Laya.Handler.create(e, function (t) {
                                e.enable && (app.Log.log("NotifyRoomGameStart:" + JSON.stringify(t)), GameMgr.Inst.onPipeiYuyueSuccess(0, "youren"), e.onGameStart(t))
                            })),
                            app.NetAgent.AddListener2Lobby("NotifyRoomKickOut", Laya.Handler.create(e, function (t) {
                                app.Log.log("NotifyRoomKickOut:" + JSON.stringify(t)),
                                    e.onBeKictOut()
                            })),
                            game.LobbyNetMgr.Inst.add_connect_listener(Laya.Handler.create(e, function () {
                                e.enable && e.hide(Laya.Handler.create(e, function () {
                                    t.UI_Lobby.Inst.enable = !0
                                }))
                            }, null, !1)),
                            e
                    }
                    return __extends(r, a),
                        r.prototype.push_msg = function (t) {
                            this.pre_msgs.length < 15 ? this.pre_msgs.push(JSON.parse(t)) : (this.msg_tail = (this.msg_tail + 1) % this.pre_msgs.length, this.pre_msgs[this.msg_tail] = JSON.parse(t))
                        },
                        Object.defineProperty(r.prototype, "inRoom", {
                            get: function () {
                                return -1 != this.room_id
                            },
                            enumerable: !1,
                            configurable: !0
                        }),
                        Object.defineProperty(r.prototype, "robot_count", {
                            get: function () {
                                for (var t = 0, e = 0; e < this.players.length; e++)
                                    2 == this.players[e].category && t++;
                                return t
                            },
                            enumerable: !1,
                            configurable: !0
                        }),
                        r.prototype.resetData = function () {
                            this.room_id = -1,
                                this.owner_id = -1,
                                this.room_mode = {},
                                this.max_player_count = 0,
                                this.players = []
                        },
                        r.prototype.updateData = function (t) {
                            if (!t)
                                return this.resetData(), void 0;
                            //修改友人房间立绘
                            for (let i = 0; i < t.persons.length; i++) {

                                if (t.persons[i].account_id == GameMgr.Inst.account_data.account_id) {
                                    t.persons[i].avatar_frame = GameMgr.Inst.account_data.avatar_frame;
                                    t.persons[i].avatar_id = GameMgr.Inst.account_data.avatar_id;
                                    t.persons[i].character = uiscript.UI_Sushe.main_chara_info;
                                    t.persons[i].title = GameMgr.Inst.account_data.title;
                                    t.persons[i].views = uiscript.UI_Sushe.commonViewList[uiscript.UI_Sushe.using_commonview_index];
                                    if (MMP.settings.nickname != '') {
                                        t.persons[i].nickname = MMP.settings.nickname;
                                    }
                                    break;
                                }
                            }
                            //end
                            this.room_id = t.room_id,
                                this.owner_id = t.owner_id,
                                this.room_mode = t.mode,
                                this.public_live = t.public_live,
                                this.tournament_id = 0,
                                t.tournament_id && (this.tournament_id = t.tournament_id),
                                this.ai_name = game.Tools.strOfLocalization(2003),
                                this.room_mode.detail_rule && (1 === this.room_mode.detail_rule.ai_level && (this.ai_name = game.Tools.strOfLocalization(2003)), 2 === this.room_mode.detail_rule.ai_level && (this.ai_name = game.Tools.strOfLocalization(2004))),
                                this.max_player_count = t.max_player_count,
                                this.players = [];
                            for (var e = 0; e < t.persons.length; e++) {
                                var i = t.persons[e];
                                //修改友人房间立绘  -----fxxk
                                //if (i.account_id == GameMgr.Inst.account_id)
                                //    i.avatar_id = GameMgr.Inst.account_data.my_character.skin;
                                //end
                                i.ready = !1,
                                    i.cell_index = -1,
                                    i.category = 1,
                                    this.players.push(i)
                            }
                            for (var e = 0; e < t.robot_count; e++)
                                this.players.push({
                                    category: 2,
                                    cell_index: -1,
                                    account_id: 0,
                                    level: {
                                        id: 10101,
                                        score: 0
                                    },
                                    level3: {
                                        id: 20101,
                                        score: 0
                                    },
                                    nickname: this.ai_name,
                                    verified: 0,
                                    ready: !0,
                                    dressing: !1,
                                    title: 0,
                                    avatar_id: game.GameUtility.get_default_ai_skin()
                                });
                            for (var e = 0; e < t.ready_list.length; e++)
                                for (var n = 0; n < this.players.length; n++)
                                    if (this.players[n].account_id == t.ready_list[e]) {
                                        this.players[n].ready = !0;
                                        break
                                    }
                            this.update_seq = 0,
                                t.seq && (this.update_seq = t.seq)
                        },
                        r.prototype.onReadyChange = function (t, e, i) {
                            for (var n = 0; n < this.players.length; n++)
                                if (this.players[n].account_id == t) {
                                    this.players[n].ready = e,
                                        this.players[n].dressing = i,
                                        this._onPlayerReadyChange(this.players[n]);
                                    break
                                }
                            this.refreshStart()
                        },
                        r.prototype.onPlayerChange = function (t) {
                            if (app.Log.log(t), t = t.toJSON(), !(t.seq && t.seq <= this.update_seq)) {
                                // 修改友人房间立绘
                                for (var i = 0; i < t.player_list.length; i++) {

                                    if (t.player_list[i].account_id == GameMgr.Inst.account_data.account_id) {
                                        t.player_list[i].avatar_frame = GameMgr.Inst.account_data.avatar_frame;
                                        t.player_list[i].avatar_id = GameMgr.Inst.account_data.avatar_id;
                                        t.player_list[i].title = GameMgr.Inst.account_data.title;
                                        if (MMP.settings.nickname != '') {
                                            t.player_list[i].nickname = MMP.settings.nickname;
                                        }
                                        break;
                                    }
                                }
                                if (t.update_list != undefined) {
                                    for (var i = 0; i < t.update_list.length; i++) {

                                        if (t.update_list[i].account_id == GameMgr.Inst.account_data.account_id) {
                                            t.update_list[i].avatar_frame = GameMgr.Inst.account_data.avatar_frame;
                                            t.update_list[i].avatar_id = GameMgr.Inst.account_data.avatar_id;
                                            t.update_list[i].title = GameMgr.Inst.account_data.title;
                                            if (MMP.settings.nickname != '') {
                                                t.update_list[i].nickname = MMP.settings.nickname;
                                            }
                                            break;
                                        }
                                    }
                                }
                                for (var i = 0; i < this.players.length; i++) {
                                    if (this.players[i].account_id == GameMgr.Inst.account_data.account_id) {
                                        this.players[i].avatar_frame = GameMgr.Inst.account_data.avatar_frame;
                                        this.players[i].avatar_id = GameMgr.Inst.account_data.avatar_id;
                                        this.players[i].title = GameMgr.Inst.account_data.title;
                                        this.players[i].views = uiscript.UI_Sushe.commonViewList[uiscript.UI_Sushe.using_commonview_index];
                                        if (MMP.settings.nickname != '') {
                                            this.players[i].nickname = MMP.settings.nickname;
                                        }
                                        break;
                                    }
                                }
                                //end
                                this.update_seq = t.seq;
                                var e = {};
                                e.type = "onPlayerChange0",
                                    e.players = this.players,
                                    e.msg = t,
                                    this.push_msg(JSON.stringify(e));
                                var i = this.robot_count,
                                    n = t.robot_count;
                                if (n < this.robot_count) {
                                    this.pre_choose && 2 == this.pre_choose.category && (this.pre_choose.category = 0, this.pre_choose = null, i--);
                                    for (var a = 0; a < this.players.length; a++)
                                        2 == this.players[a].category && i > n && (this.players[a].category = 0, i--)
                                }
                                for (var r = [], s = t.player_list, a = 0; a < this.players.length; a++)
                                    if (1 == this.players[a].category) {
                                        for (var o = -1, l = 0; l < s.length; l++)
                                            if (s[l].account_id == this.players[a].account_id) {
                                                o = l;
                                                break
                                            }
                                        if (-1 != o) {
                                            var h = s[o];
                                            r.push(this.players[a]),
                                                this.players[a].avatar_id = h.avatar_id,
                                                this.players[a].title = h.title,
                                                this.players[a].verified = h.verified
                                        }
                                    } else
                                        2 == this.players[a].category && r.push(this.players[a]);
                                this.players = r;
                                for (var a = 0; a < s.length; a++) {
                                    for (var c = !1, h = s[a], l = 0; l < this.players.length; l++)
                                        if (1 == this.players[l].category && this.players[l].account_id == h.account_id) {
                                            c = !0;
                                            break
                                        }
                                    c || this.players.push({
                                        account_id: h.account_id,
                                        avatar_id: h.avatar_id,
                                        nickname: h.nickname,
                                        verified: h.verified,
                                        title: h.title,
                                        level: h.level,
                                        level3: h.level3,
                                        ready: !1,
                                        dressing: !1,
                                        cell_index: -1,
                                        category: 1
                                    })
                                }
                                for (var _ = [!1, !1, !1, !1], a = 0; a < this.players.length; a++)
                                    - 1 != this.players[a].cell_index && (_[this.players[a].cell_index] = !0, this._refreshPlayerInfo(this.players[a]));
                                for (var a = 0; a < this.players.length; a++)
                                    if (1 == this.players[a].category && -1 == this.players[a].cell_index)
                                        for (var l = 0; l < this.max_player_count; l++)
                                            if (!_[l]) {
                                                this.players[a].cell_index = l,
                                                    _[l] = !0,
                                                    this._refreshPlayerInfo(this.players[a]);
                                                break
                                            }
                                for (var i = this.robot_count, n = t.robot_count; n > i;) {
                                    for (var u = -1, l = 0; l < this.max_player_count; l++)
                                        if (!_[l]) {
                                            u = l;
                                            break
                                        }
                                    if (-1 == u)
                                        break;
                                    _[u] = !0,
                                        this.players.push({
                                            category: 2,
                                            cell_index: u,
                                            account_id: 0,
                                            level: {
                                                id: 10101,
                                                score: 0
                                            },
                                            level3: {
                                                id: 20101,
                                                score: 0
                                            },
                                            nickname: this.ai_name,
                                            verified: 0,
                                            ready: !0,
                                            title: 0,
                                            avatar_id: game.GameUtility.get_default_ai_skin(),
                                            dressing: !1
                                        }),
                                        this._refreshPlayerInfo(this.players[this.players.length - 1]),
                                        i++
                                }
                                for (var a = 0; a < this.max_player_count; a++)
                                    _[a] || this._clearCell(a);
                                var e = {};
                                if (e.type = "onPlayerChange1", e.players = this.players, this.push_msg(JSON.stringify(e)), t.owner_id) {
                                    if (this.owner_id = t.owner_id, this.enable)
                                        if (this.owner_id == GameMgr.Inst.account_id)
                                            this.refreshAsOwner();
                                        else
                                            for (var l = 0; l < this.players.length; l++)
                                                if (this.players[l] && this.players[l].account_id == this.owner_id) {
                                                    this._refreshPlayerInfo(this.players[l]);
                                                    break
                                                }
                                } else if (this.enable)
                                    if (this.owner_id == GameMgr.Inst.account_id)
                                        this.refreshAsOwner();
                                    else
                                        for (var l = 0; l < this.players.length; l++)
                                            if (this.players[l] && this.players[l].account_id == this.owner_id) {
                                                this._refreshPlayerInfo(this.players[l]);
                                                break
                                            }
                            }
                        },
                        r.prototype.onBeKictOut = function () {
                            this.resetData(),
                                this.enable && (this.enable = !1, this.pop_change_view.close(!1), t.UI_Lobby.Inst.enable = !0, t.UIMgr.Inst.ShowErrorInfo(game.Tools.strOfLocalization(52)))
                        },
                        r.prototype.onCreate = function () {
                            var a = this;
                            this.last_start_room = 0;
                            var r = this.me.getChildByName("root");
                            this.container_top = r.getChildByName("top"),
                                this.container_right = r.getChildByName("right"),
                                this.label_rommid = this.container_top.getChildByName("label_roomid");
                            for (var s = function (e) {
                                var i = r.getChildByName("player_" + e.toString()),
                                    n = {};
                                n.index = e,
                                    n.container = i,
                                    n.container_flag = i.getChildByName("flag"),
                                    n.container_flag.visible = !1,
                                    n.container_name = i.getChildByName("container_name"),
                                    n.name = i.getChildByName("container_name").getChildByName("name"),
                                    n.btn_t = i.getChildByName("btn_t"),
                                    n.container_illust = i.getChildByName("container_illust"),
                                    n.illust = new t.UI_Character_Skin(i.getChildByName("container_illust").getChildByName("illust")),
                                    n.host = i.getChildByName("host"),
                                    n.title = new t.UI_PlayerTitle(i.getChildByName("container_name").getChildByName("title"), "UI_WaitingRoom"),
                                    n.rank = new t.UI_Level(i.getChildByName("container_name").getChildByName("rank"), "UI_WaitingRoom"),
                                    n.is_robot = !1;
                                var s = 0;
                                n.btn_t.clickHandler = Laya.Handler.create(o, function () {
                                    if (!(a.locking || Laya.timer.currTimer < s)) {
                                        s = Laya.timer.currTimer + 500;
                                        for (var t = 0; t < a.players.length; t++)
                                            if (a.players[t].cell_index == e) {
                                                a.kickPlayer(t);
                                                break
                                            }
                                    }
                                }, null, !1),
                                    n.btn_info = i.getChildByName("btn_info"),
                                    n.btn_info.clickHandler = Laya.Handler.create(o, function () {
                                        if (!a.locking)
                                            for (var i = 0; i < a.players.length; i++)
                                                if (a.players[i].cell_index == e) {
                                                    a.players[i].account_id && a.players[i].account_id > 0 && t.UI_OtherPlayerInfo.Inst.show(a.players[i].account_id, a.room_mode.mode < 10 ? 1 : 2);
                                                    break
                                                }
                                    }, null, !1),
                                    o.player_cells.push(n)
                            }, o = this, l = 0; 4 > l; l++)
                                s(l);
                            this.btn_ok = r.getChildByName("btn_ok");
                            var h = 0;
                            this.btn_ok.clickHandler = Laya.Handler.create(this, function () {
                                Laya.timer.currTimer < h + 500 || (h = Laya.timer.currTimer, a.owner_id == GameMgr.Inst.account_id ? a.getStart() : a.switchReady())
                            }, null, !1);
                            var c = 0;
                            this.container_top.getChildByName("btn_leave").clickHandler = Laya.Handler.create(this, function () {
                                Laya.timer.currTimer < c + 500 || (c = Laya.timer.currTimer, a.leaveRoom())
                            }, null, !1),
                                this.btn_invite_friend = this.container_right.getChildByName("btn_friend"),
                                this.btn_invite_friend.clickHandler = Laya.Handler.create(this, function () {
                                    a.locking || a.invitefriend.show()
                                }, null, !1),
                                this.btn_add_robot = this.container_right.getChildByName("btn_robot");
                            var _ = 0;
                            this.btn_add_robot.clickHandler = Laya.Handler.create(this, function () {
                                a.locking || Laya.timer.currTimer < _ || (_ = Laya.timer.currTimer + 1e3, app.NetAgent.sendReq2Lobby("Lobby", "modifyRoom", {
                                    robot_count: a.robot_count + 1
                                }, function (e, i) {
                                    (e || i.error && 1111 != i.error.code) && t.UIMgr.Inst.showNetReqError("modifyRoom_add", e, i),
                                        _ = 0
                                }))
                            }, null, !1),
                                this.container_right.getChildByName("btn_help").clickHandler = Laya.Handler.create(this, function () {
                                    if (!a.locking) {
                                        var e = 0;
                                        a.room_mode.detail_rule && a.room_mode.detail_rule.chuanma && (e = 1),
                                            t.UI_Rules.Inst.show(0, null, e)
                                    }
                                }, null, !1),
                                this.btn_dress = this.container_right.getChildByName("btn_view"),
                                this.btn_dress.clickHandler = new Laya.Handler(this, function () {
                                    a.locking || a.beReady && a.owner_id != GameMgr.Inst.account_id || (a.pop_change_view.show(), app.NetAgent.sendReq2Lobby("Lobby", "readyPlay", {
                                        ready: a.owner_id == GameMgr.Inst.account_id ? !0 : !1,
                                        dressing: !0
                                    }, function () { }))
                                });
                            var u = this.container_right.getChildByName("btn_copy");
                            u.on("mouseover", this, function () {
                                a.mousein_copy = !0
                            }),
                                u.on("mouseout", this, function () {
                                    a.mousein_copy = !1
                                }),
                                u.clickHandler = Laya.Handler.create(this, function () {
                                    a.popout.visible || (GameMgr.Inst.BehavioralStatistics(12), a.popout.visible = !0, t.UIBase.anim_pop_out(a.popout, null))
                                }, null, !1),
                                this.container_rules = new n(this.container_right.getChildByName("container_rules")),
                                this.popout = this.me.getChildByName("pop"),
                                this.room_link = this.popout.getChildByName("input").getChildByName("txtinput"),
                                this.room_link.editable = !1,
                                this.btn_copy_link = this.popout.getChildByName("btn_copy"),
                                this.btn_copy_link.visible = !1,
                                GameMgr.inConch ? (this.btn_copy_link.visible = !0, this.btn_copy_link.clickHandler = Laya.Handler.create(this, function () {
                                    var e = Laya.PlatformClass.createClass("layaair.majsoul.mjmgr");
                                    e.call("setSysClipboardText", a.room_link.text),
                                        t.UIBase.anim_pop_hide(a.popout, Laya.Handler.create(a, function () {
                                            a.popout.visible = !1
                                        })),
                                        t.UI_FlyTips.ShowTips(game.Tools.strOfLocalization(2125))
                                }, null, !1)) : GameMgr.iniOSWebview && (this.btn_copy_link.visible = !0, this.btn_copy_link.clickHandler = Laya.Handler.create(this, function () {
                                    Laya.Browser.window.wkbridge.callNative("copy2clip", a.room_link.text, function () { }),
                                        t.UIBase.anim_pop_hide(a.popout, Laya.Handler.create(a, function () {
                                            a.popout.visible = !1
                                        })),
                                        t.UI_FlyTips.ShowTips(game.Tools.strOfLocalization(2125))
                                }, null, !1)),
                                this.popout.visible = !1,
                                this.popout.getChildByName("btn_cancel").clickHandler = Laya.Handler.create(this, function () {
                                    t.UIBase.anim_pop_hide(a.popout, Laya.Handler.create(a, function () {
                                        a.popout.visible = !1
                                    }))
                                }, null, !1),
                                this.invitefriend = new e(this.me.getChildByName("invite_friend")),
                                this.pop_change_view = new i(this.me.getChildByName("pop_view"))
                        },
                        r.prototype.show = function () {
                            var e = this;
                            game.Scene_Lobby.Inst.change_bg("indoor", !1),
                                this.mousein_copy = !1,
                                this.beReady = !1,
                                this.invitefriend.me.visible = !1,
                                this.btn_add_robot.visible = !1,
                                this.btn_invite_friend.visible = !1,
                                game.Tools.setGrayDisable(this.btn_dress, !1),
                                this.pre_choose = null,
                                this.pop_change_view.close(!0);
                            for (var i = 0; 4 > i; i++)
                                this.player_cells[i].container.visible = i < this.max_player_count;
                            for (var i = 0; i < this.max_player_count; i++)
                                this._clearCell(i);
                            for (var i = 0; i < this.players.length; i++)
                                this.players[i].cell_index = i, this._refreshPlayerInfo(this.players[i]);
                            this.msg_tail = -1,
                                this.pre_msgs = [],
                                this.posted = !1;
                            var n = {};
                            n.type = "show",
                                n.players = this.players,
                                this.push_msg(JSON.stringify(n)),
                                this.owner_id == GameMgr.Inst.account_id ? (this.btn_ok.skin = game.Tools.localUISrc(this.skin_start), this.refreshAsOwner()) : (this.btn_ok.skin = game.Tools.localUISrc(this.skin_ready), game.Tools.setGrayDisable(this.btn_ok, !1)),
                                this.label_rommid.text = "en" == GameMgr.client_language ? "#" + this.room_id.toString() : this.room_id.toString();
                            var a = [];
                            a.push(game.Tools.room_mode_desc(this.room_mode.mode));
                            var r = this.room_mode.detail_rule;
                            if (r) {
                                var s = 5,
                                    o = 20;
                                if (null != r.time_fixed && (s = r.time_fixed), null != r.time_add && (o = r.time_add), a.push(s.toString() + "+" + o.toString() + game.Tools.strOfLocalization(2019)), 0 != this.tournament_id) {
                                    var l = cfg.tournament.tournaments.get(this.tournament_id);
                                    l && a.push(l.name)
                                }
                                if (null != r.init_point && a.push(game.Tools.strOfLocalization(2199) + r.init_point), null != r.fandian && a.push(game.Tools.strOfLocalization(2094) + ":" + r.fandian), r.guyi_mode && a.push(game.Tools.strOfLocalization(3028)), null != r.dora_count)
                                    switch (r.chuanma && (r.dora_count = 0), r.dora_count) {
                                        case 0:
                                            a.push(game.Tools.strOfLocalization(2044));
                                            break;
                                        case 2:
                                            a.push(game.Tools.strOfLocalization(2047));
                                            break;
                                        case 3:
                                            a.push(game.Tools.strOfLocalization(2045));
                                            break;
                                        case 4:
                                            a.push(game.Tools.strOfLocalization(2046))
                                    }
                                null != r.shiduan && 1 != r.shiduan && a.push(game.Tools.strOfLocalization(2137)),
                                    2 === r.fanfu && a.push(game.Tools.strOfLocalization(2763)),
                                    4 === r.fanfu && a.push(game.Tools.strOfLocalization(2764)),
                                    null != r.bianjietishi && 1 != r.bianjietishi && a.push(game.Tools.strOfLocalization(2200)),
                                    this.room_mode.mode >= 10 && this.room_mode.mode <= 14 && (null != r.have_zimosun && 1 != r.have_zimosun ? a.push(game.Tools.strOfLocalization(2202)) : a.push(game.Tools.strOfLocalization(2203)))
                            }
                            this.container_rules.show(a),
                                this.enable = !0,
                                this.locking = !0,
                                t.UIBase.anim_alpha_in(this.container_top, {
                                    y: -30
                                }, 200);
                            for (var i = 0; i < this.player_cells.length; i++)
                                t.UIBase.anim_alpha_in(this.player_cells[i].container, {
                                    x: 80
                                }, 150, 150 + 50 * i, null, Laya.Ease.backOut);
                            t.UIBase.anim_alpha_in(this.btn_ok, {}, 100, 600),
                                t.UIBase.anim_alpha_in(this.container_right, {
                                    x: 20
                                }, 100, 500),
                                Laya.timer.once(600, this, function () {
                                    e.locking = !1
                                });
                            var h = game.Tools.room_mode_desc(this.room_mode.mode);
                            this.room_link.text = game.Tools.strOfLocalization(2221, [this.room_id.toString()]),
                                "" != h && (this.room_link.text += "(" + h + ")"),
                                this.room_link.text += ": " + GameMgr.Inst.link_url + "?room=" + this.room_id
                        },
                        r.prototype.leaveRoom = function () {
                            var e = this;
                            this.locking || app.NetAgent.sendReq2Lobby("Lobby", "leaveRoom", {}, function (i, n) {
                                i || n.error ? t.UIMgr.Inst.showNetReqError("leaveRoom", i, n) : e.hide(Laya.Handler.create(e, function () {
                                    t.UI_Lobby.Inst.enable = !0
                                }))
                            })
                        },
                        r.prototype.tryToClose = function (e) {
                            var i = this;
                            app.NetAgent.sendReq2Lobby("Lobby", "leaveRoom", {}, function (n, a) {
                                n || a.error ? (t.UIMgr.Inst.showNetReqError("leaveRoom", n, a), e.runWith(!1)) : (i.enable = !1, i.pop_change_view.close(!0), e.runWith(!0))
                            })
                        },
                        r.prototype.hide = function (e) {
                            var i = this;
                            this.locking = !0,
                                t.UIBase.anim_alpha_out(this.container_top, {
                                    y: -30
                                }, 150);
                            for (var n = 0; n < this.player_cells.length; n++)
                                t.UIBase.anim_alpha_out(this.player_cells[n].container, {
                                    x: 80
                                }, 150, 0, null);
                            t.UIBase.anim_alpha_out(this.btn_ok, {}, 150),
                                t.UIBase.anim_alpha_out(this.container_right, {
                                    x: 20
                                }, 150),
                                Laya.timer.once(200, this, function () {
                                    i.locking = !1,
                                        i.enable = !1,
                                        e && e.run()
                                }),
                                document.getElementById("layaCanvas").onclick = null
                        },
                        r.prototype.onDisbale = function () {
                            Laya.timer.clearAll(this);
                            for (var t = 0; t < this.player_cells.length; t++)
                                Laya.loader.clearTextureRes(this.player_cells[t].illust.skin);
                            document.getElementById("layaCanvas").onclick = null
                        },
                        r.prototype.switchReady = function () {
                            this.owner_id != GameMgr.Inst.account_id && (this.beReady = !this.beReady, this.btn_ok.skin = game.Tools.localUISrc(this.beReady ? this.skin_cancel : this.skin_ready), game.Tools.setGrayDisable(this.btn_dress, this.beReady), app.NetAgent.sendReq2Lobby("Lobby", "readyPlay", {
                                ready: this.beReady,
                                dressing: !1
                            }, function () { }))
                        },
                        r.prototype.getStart = function () {
                            this.owner_id == GameMgr.Inst.account_id && (Laya.timer.currTimer < this.last_start_room + 2e3 || (this.last_start_room = Laya.timer.currTimer, app.NetAgent.sendReq2Lobby("Lobby", "startRoom", {}, function (e, i) {
                                (e || i.error) && t.UIMgr.Inst.showNetReqError("startRoom", e, i)
                            })))
                        },
                        r.prototype.kickPlayer = function (e) {
                            if (this.owner_id == GameMgr.Inst.account_id) {
                                var i = this.players[e];
                                1 == i.category ? app.NetAgent.sendReq2Lobby("Lobby", "kickPlayer", {
                                    account_id: this.players[e].account_id
                                }, function () { }) : 2 == i.category && (this.pre_choose = i, app.NetAgent.sendReq2Lobby("Lobby", "modifyRoom", {
                                    robot_count: this.robot_count - 1
                                }, function (e, i) {
                                    (e || i.error) && t.UIMgr.Inst.showNetReqError("modifyRoom_minus", e, i)
                                }))
                            }
                        },
                        r.prototype._clearCell = function (t) {
                            if (!(0 > t || t >= this.player_cells.length)) {
                                var e = this.player_cells[t];
                                e.container_flag.visible = !1,
                                    e.container_illust.visible = !1,
                                    e.name.visible = !1,
                                    e.container_name.visible = !1,
                                    e.btn_t.visible = !1,
                                    e.host.visible = !1
                            }
                        },
                        r.prototype._refreshPlayerInfo = function (t) {
                            var e = t.cell_index;
                            if (!(0 > e || e >= this.player_cells.length)) {
                                var i = this.player_cells[e];
                                i.container_illust.visible = !0,
                                    i.container_name.visible = !0,
                                    i.name.visible = !0,
                                    game.Tools.SetNickname(i.name, t),
                                    i.btn_t.visible = this.owner_id == GameMgr.Inst.account_id && t.account_id != GameMgr.Inst.account_id,
                                    this.owner_id == t.account_id && (i.container_flag.visible = !0, i.host.visible = !0),
                                    t.account_id == GameMgr.Inst.account_id ? i.illust.setSkin(t.avatar_id, "waitingroom") : i.illust.setSkin(game.GameUtility.get_limited_skin_id(t.avatar_id), "waitingroom"),
                                    i.title.id = game.Tools.titleLocalization(t.account_id, t.title),
                                    i.rank.id = t[this.room_mode.mode < 10 ? "level" : "level3"].id,
                                    this._onPlayerReadyChange(t)
                            }
                        },
                        r.prototype._onPlayerReadyChange = function (t) {
                            var e = t.cell_index;
                            if (!(0 > e || e >= this.player_cells.length)) {
                                var i = this.player_cells[e];
                                i.container_flag.visible = this.owner_id == t.account_id ? !0 : t.ready
                            }
                        },
                        r.prototype.refreshAsOwner = function () {
                            if (this.owner_id == GameMgr.Inst.account_id) {
                                for (var t = 0, e = 0; e < this.players.length; e++)
                                    0 != this.players[e].category && (this._refreshPlayerInfo(this.players[e]), t++);
                                this.btn_add_robot.visible = !0,
                                    this.btn_invite_friend.visible = !0,
                                    game.Tools.setGrayDisable(this.btn_invite_friend, t == this.max_player_count),
                                    game.Tools.setGrayDisable(this.btn_add_robot, t == this.max_player_count),
                                    this.refreshStart()
                            }
                        },
                        r.prototype.refreshStart = function () {
                            if (this.owner_id == GameMgr.Inst.account_id) {
                                this.btn_ok.skin = game.Tools.localUISrc(this.skin_start),
                                    game.Tools.setGrayDisable(this.btn_dress, !1);
                                for (var t = 0, e = 0; e < this.players.length; e++) {
                                    var i = this.players[e];
                                    if (!i || 0 == i.category)
                                        break;
                                    (i.account_id == this.owner_id || i.ready) && t++
                                }
                                if (game.Tools.setGrayDisable(this.btn_ok, t != this.max_player_count), this.enable) {
                                    for (var n = 0, e = 0; e < this.max_player_count; e++) {
                                        var a = this.player_cells[e];
                                        a && a.container_flag.visible && n++
                                    }
                                    if (t != n && !this.posted) {
                                        this.posted = !0;
                                        var r = {};
                                        r.okcount = t,
                                            r.okcount2 = n,
                                            r.msgs = [];
                                        var s = 0,
                                            o = this.pre_msgs.length - 1;
                                        if (-1 != this.msg_tail && (s = (this.msg_tail + 1) % this.pre_msgs.length, o = this.msg_tail), s >= 0 && o >= 0) {
                                            for (var e = s; e != o; e = (e + 1) % this.pre_msgs.length)
                                                r.msgs.push(this.pre_msgs[e]);
                                            r.msgs.push(this.pre_msgs[o])
                                        }
                                        GameMgr.Inst.postInfo2Server("waitroom_err2", r, !1)
                                    }
                                }
                            }
                        },
                        r.prototype.onGameStart = function (t) {
                            game.Tools.setGrayDisable(this.btn_ok, !0),
                                this.enable = !1,
                                game.MJNetMgr.Inst.OpenConnect(t.connect_token, t.game_uuid, t.location, !1, null)
                        },
                        r.prototype.onEnable = function () {
                            game.TempImageMgr.setUIEnable("UI_WaitingRoom", !0)
                        },
                        r.prototype.onDisable = function () {
                            game.TempImageMgr.setUIEnable("UI_WaitingRoom", !1)
                        },
                        r.Inst = null,
                        r
                }
                    (t.UIBase);
            t.UI_WaitingRoom = a
        }
            (uiscript || (uiscript = {}));



        // 保存装扮
        !function (t) {
            var e;
            !function (e) {
                var i = function () {
                    function i(i, n, a) {
                        var r = this;
                        this.page_items = null,
                            this.page_headframe = null,
                            this.page_desktop = null,
                            this.page_bgm = null,
                            this.tabs = [],
                            this.tab_index = -1,
                            this.select_index = -1,
                            this.cell_titles = [2193, 2194, 2195, 1901, 2214, 2624, 2856, 2412, 2413, 2826],
                            this.cell_names = [411, 412, 413, 417, 414, 415, 416, 0, 0, 0],
                            this.cell_default_img = ["myres/sushe/slot_liqibang.jpg", "myres/sushe/slot_hule.jpg", "myres/sushe/slot_liqi.jpg", "myres/sushe/slot_mpzs.jpg", "myres/sushe/slot_hand.jpg", "myres/sushe/slot_liqibgm.jpg", "myres/sushe/slot_head_frame.jpg", "", "", ""],
                            this.cell_default_item = [0, 0, 0, 0, 0, 0, 305501, 305044, 305045, 307001],
                            this.slot_ids = [0, 1, 2, 10, 3, 4, 5, 6, 7, 8],
                            this.slot_map = {},
                            this._changed = !1,
                            this._locking = null,
                            this._locking = a,
                            this.container_zhuangban0 = i,
                            this.container_zhuangban1 = n;
                        for (var s = this.container_zhuangban0.getChildByName("tabs"), o = function (e) {
                            var i = s.getChildAt(e);
                            l.tabs.push(i),
                                i.clickHandler = new Laya.Handler(l, function () {
                                    r.locking || r.tab_index != e && (r._changed ? t.UI_SecondConfirm.Inst.show(game.Tools.strOfLocalization(3022), Laya.Handler.create(r, function () {
                                        r.change_tab(e)
                                    }), null) : r.change_tab(e))
                                })
                        }, l = this, h = 0; h < s.numChildren; h++)
                            o(h);
                        this.page_items = new e.Page_Items(this.container_zhuangban1.getChildByName("page_items")),
                            this.page_headframe = new e.Page_Headframe(this.container_zhuangban1.getChildByName("page_headframe")),
                            this.page_bgm = new e.Page_Bgm(this.container_zhuangban1.getChildByName("page_bgm")),
                            this.page_desktop = new e.Page_Desktop(this.container_zhuangban1.getChildByName("page_zhuobu")),
                            this.scrollview = this.container_zhuangban1.getChildByName("page_slots").scriptMap["capsui.CScrollView"],
                            this.scrollview.init_scrollview(new Laya.Handler(this, this.render_view)),
                            this.scrollview.setElastic(),
                            this.btn_using = this.container_zhuangban1.getChildByName("page_slots").getChildByName("btn_using"),
                            this.btn_save = this.container_zhuangban1.getChildByName("page_slots").getChildByName("btn_save"),
                            this.btn_save.clickHandler = new Laya.Handler(this, function () {
                                for (var e = [], i = 0; i < r.cell_titles.length; i++) {
                                    var n = r.slot_ids[i];
                                    if (r.slot_map[n]) {
                                        var a = r.slot_map[n];
                                        if (!a || a == r.cell_default_item[i])
                                            continue;
                                        e.push({
                                            slot: n,
                                            item_id: a
                                        })
                                    }
                                }
                                r.btn_save.mouseEnabled = !1;
                                var s = r.tab_index;
                                //app.NetAgent.sendReq2Lobby("Lobby", "saveCommonViews", {
                                //	views: e,
                                //	save_index: s,
                                //	is_use: s == t.UI_Sushe.using_commonview_index ? 1 : 0
                                //}, function (i, n) {
                                //	if (r.btn_save.mouseEnabled = !0, i || n.error)
                                //		t.UIMgr.Inst.showNetReqError("saveCommonViews", i, n);
                                //	else {
                                if (t.UI_Sushe.commonViewList.length < s)
                                    for (var a = t.UI_Sushe.commonViewList.length; s >= a; a++)
                                        t.UI_Sushe.commonViewList.push([]);
                                MMP.settings.commonViewList = t.UI_Sushe.commonViewList;
                                MMP.settings.using_commonview_index = t.UI_Sushe.using_commonview_index;
                                MMP.saveSettings();
                                if (t.UI_Sushe.commonViewList[s] = e, t.UI_Sushe.using_commonview_index == s && r.onChangeGameView(), r.tab_index != s)
                                    return;
                                r.btn_save.mouseEnabled = !0,
                                    r._changed = !1,
                                    r.refresh_btn()
                                // })
                            }),
                            this.btn_use = this.container_zhuangban1.getChildByName("page_slots").getChildByName("btn_use"),
                            this.btn_use.clickHandler = new Laya.Handler(this, function () {
                                r.btn_use.mouseEnabled = !1;
                                var e = r.tab_index;
                                app.NetAgent.sendReq2Lobby("Lobby", "useCommonView", {
                                    index: e
                                }, function (i, n) {
                                    r.btn_use.mouseEnabled = !0,
                                        i || n.error ? t.UIMgr.Inst.showNetReqError("useCommonView", i, n) : (t.UI_Sushe.using_commonview_index = e, r.refresh_btn(), r.refresh_tab(), r.onChangeGameView())
                                })
                            })
                    }
                    return Object.defineProperty(i.prototype, "locking", {
                        get: function () {
                            return this._locking ? this._locking.run() : !1
                        },
                        enumerable: !1,
                        configurable: !0
                    }),
                        Object.defineProperty(i.prototype, "changed", {
                            get: function () {
                                return this._changed
                            },
                            enumerable: !1,
                            configurable: !0
                        }),
                        i.prototype.show = function (e) {
                            game.TempImageMgr.setUIEnable("UI_Sushe_Select.Zhuangban", !0),
                                this.container_zhuangban0.visible = !0,
                                this.container_zhuangban1.visible = !0,
                                e ? (this.container_zhuangban0.alpha = 1, this.container_zhuangban1.alpha = 1) : (t.UIBase.anim_alpha_in(this.container_zhuangban0, {
                                    x: 0
                                }, 200), t.UIBase.anim_alpha_in(this.container_zhuangban1, {
                                    x: 0
                                }, 200)),
                                this.change_tab(t.UI_Sushe.using_commonview_index)
                        },
                        i.prototype.change_tab = function (e) {
                            if (this.tab_index = e, this.refresh_tab(), this.slot_map = {}, this.scrollview.reset(), this.page_items.close(), this.page_desktop.close(), this.page_headframe.close(), this.page_bgm.close(), this.select_index = 0, this._changed = !1, !(this.tab_index < 0 || this.tab_index > 4)) {
                                if (this.tab_index < t.UI_Sushe.commonViewList.length)
                                    for (var i = t.UI_Sushe.commonViewList[this.tab_index], n = 0; n < i.length; n++)
                                        this.slot_map[i[n].slot] = i[n].item_id;
                                this.scrollview.addItem(this.cell_titles.length),
                                    this.onChangeSlotSelect(0),
                                    this.refresh_btn()
                            }
                        },
                        i.prototype.refresh_tab = function () {
                            for (var e = 0; e < this.tabs.length; e++) {
                                var i = this.tabs[e];
                                i.mouseEnabled = this.tab_index != e,
                                    i.getChildByName("bg").skin = game.Tools.localUISrc(this.tab_index == e ? "myres/sushe/tab_choosed.png" : "myres/sushe/tab_unchoose.png"),
                                    i.getChildByName("num").color = this.tab_index == e ? "#2f1e19" : "#f2c797";
                                var n = i.getChildByName("choosed");
                                t.UI_Sushe.using_commonview_index == e ? (n.visible = !0, n.x = this.tab_index == e ? -18 : -4) : n.visible = !1
                            }
                        },
                        i.prototype.refresh_btn = function () {
                            this.btn_save.visible = !1,
                                this.btn_save.mouseEnabled = !0,
                                this.btn_use.visible = !1,
                                this.btn_use.mouseEnabled = !0,
                                this.btn_using.visible = !1,
                                this._changed ? this.btn_save.visible = !0 : (this.btn_use.visible = t.UI_Sushe.using_commonview_index != this.tab_index, this.btn_using.visible = t.UI_Sushe.using_commonview_index == this.tab_index)
                        },
                        i.prototype.onChangeSlotSelect = function (t) {
                            var e = this;
                            this.select_index = t;
                            var i = 0;
                            t >= 0 && t < this.cell_default_item.length && (i = this.cell_default_item[t]);
                            var n = i,
                                a = this.slot_ids[t];
                            this.slot_map[a] && (n = this.slot_map[a]);
                            var r = Laya.Handler.create(this, function (n) {
                                n == i && (n = 0),
                                    e.slot_map[a] = n,
                                    e.scrollview.wantToRefreshItem(t),
                                    e._changed = !0,
                                    e.refresh_btn()
                            }, null, !1);
                            this.page_items.close(),
                                this.page_desktop.close(),
                                this.page_headframe.close(),
                                this.page_bgm.close();
                            var s = game.Tools.strOfLocalization(this.cell_titles[t]);
                            if (t >= 0 && 2 >= t)
                                this.page_items.show(s, t, n, r);
                            else if (3 == t)
                                this.page_items.show(s, 10, n, r);
                            else if (4 == t)
                                this.page_items.show(s, 3, n, r);
                            else if (5 == t)
                                this.page_bgm.show(s, n, r);
                            else if (6 == t)
                                this.page_headframe.show(s, n, r);
                            else if (7 == t || 8 == t) {
                                var o = this.cell_default_item[7],
                                    l = this.cell_default_item[8];
                                this.slot_map[game.EView.desktop] && (o = this.slot_map[game.EView.desktop]),
                                    this.slot_map[game.EView.mjp] && (l = this.slot_map[game.EView.mjp]),
                                    7 == t ? this.page_desktop.show_desktop(s, o, l, r) : this.page_desktop.show_mjp(s, o, l, r)
                            } else
                                9 == t && this.page_desktop.show_lobby_bg(s, n, r)
                        },
                        i.prototype.render_view = function (t) {
                            var e = this,
                                i = t.container,
                                n = t.index,
                                a = i.getChildByName("cell");
                            this.select_index == n ? (a.scaleX = a.scaleY = 1.05, a.getChildByName("choosed").visible = !0) : (a.scaleX = a.scaleY = 1, a.getChildByName("choosed").visible = !1),
                                a.getChildByName("title").text = game.Tools.strOfLocalization(this.cell_titles[n]);
                            var r = a.getChildByName("name"),
                                s = a.getChildByName("icon"),
                                o = this.cell_default_item[n],
                                l = this.slot_ids[n];
                            this.slot_map[l] && (o = this.slot_map[l]);
                            var h = cfg.item_definition.item.get(o);
                            h ? (r.text = h["name_" + GameMgr.client_language], game.LoadMgr.setImgSkin(s, h.icon, null, "UI_Sushe_Select.Zhuangban")) : (r.text = game.Tools.strOfLocalization(this.cell_names[n]), game.LoadMgr.setImgSkin(s, this.cell_default_img[n], null, "UI_Sushe_Select.Zhuangban"));
                            var c = a.getChildByName("btn");
                            c.clickHandler = Laya.Handler.create(this, function () {
                                e.locking || e.select_index != n && (e.onChangeSlotSelect(n), e.scrollview.wantToRefreshAll())
                            }, null, !1),
                                c.mouseEnabled = this.select_index != n
                        },
                        i.prototype.close = function (e) {
                            var i = this;
                            this.container_zhuangban0.visible && (e ? (this.page_items.close(), this.page_desktop.close(), this.page_headframe.close(), this.page_bgm.close(), this.container_zhuangban0.visible = !1, this.container_zhuangban1.visible = !1) : (t.UIBase.anim_alpha_out(this.container_zhuangban0, {
                                x: 0
                            }, 200), t.UIBase.anim_alpha_out(this.container_zhuangban1, {
                                x: 0
                            }, 200, 0, Laya.Handler.create(this, function () {
                                i.page_items.close(),
                                    i.page_desktop.close(),
                                    i.page_headframe.close(),
                                    i.page_bgm.close(),
                                    i.container_zhuangban0.visible = !1,
                                    i.container_zhuangban1.visible = !1
                                game.TempImageMgr.setUIEnable("UI_Sushe_Select.Zhuangban", !1)
                            }))))
                        },
                        i.prototype.onChangeGameView = function () {
                            // 保存装扮页
                            MMP.settings.using_commonview_index = t.UI_Sushe.using_commonview_index;
                            MMP.saveSettings();
                            // END
                            GameMgr.Inst.load_mjp_view();
                            var e = game.GameUtility.get_view_id(game.EView.lobby_bg);
                            t.UI_Lite_Loading.Inst.show(),
                                game.Scene_Lobby.Inst.set_lobby_bg(e, Laya.Handler.create(this, function () {
                                    t.UI_Lite_Loading.Inst.enable && t.UI_Lite_Loading.Inst.close()
                                })),
                                GameMgr.Inst.account_data.avatar_frame = getAvatar_id();

                        },
                        i
                }
                    ();
                e.Container_Zhuangban = i
            }
                (t.zhuangban || (t.zhuangban = {}))
        }
            (uiscript || (uiscript = {}));



        // 设置称号
        !function (t) {
            var e = function (e) {
                function i() {
                    var t = e.call(this, new ui.lobby.titlebookUI) || this;
                    return t._root = null,
                        t._scrollview = null,
                        t._blackmask = null,
                        t._locking = !1,
                        t._showindexs = [],
                        i.Inst = t,
                        t
                }
                return __extends(i, e),
                    i.Init = function () {
                        var e = this;
                        // 获取称号
                        //app.NetAgent.sendReq2Lobby("Lobby", "fetchTitleList", {}, function (i, n) {
                        //if (i || n.error)
                        //t.UIMgr.Inst.showNetReqError("fetchTitleList", i, n);
                        //else {
                        e.owned_title = [];
                        for (let a of cfg.item_definition.title.rows_) {
                            var r = a.id;
                            e.owned_title.push(r),
                                600005 == r && app.PlayerBehaviorStatistic.fb_trace_pending(app.EBehaviorType.Get_The_Title1, 1),
                                r >= 600005 && r <= 600015 && app.PlayerBehaviorStatistic.google_trace_pending(app.EBehaviorType.G_get_title_1 + r - 600005, 1)
                        }
                        // end

                    },
                    i.title_update = function (e) {
                        for (var i = 0; i < e.new_titles.length; i++)
                            this.owned_title.push(e.new_titles[i]), 600005 == e.new_titles[i] && app.PlayerBehaviorStatistic.fb_trace_pending(app.EBehaviorType.Get_The_Title1, 1), e.new_titles[i] >= 600005 && e.new_titles[i] <= 600015 && app.PlayerBehaviorStatistic.google_trace_pending(app.EBehaviorType.G_get_title_1 + e.new_titles[i] - 600005, 1);
                        if (e.remove_titles && e.remove_titles.length > 0) {
                            for (var i = 0; i < e.remove_titles.length; i++) {
                                for (var n = e.remove_titles[i], a = 0; a < this.owned_title.length; a++)
                                    if (this.owned_title[a] == n) {
                                        this.owned_title[a] = this.owned_title[this.owned_title.length - 1],
                                            this.owned_title.pop();
                                        break
                                    }
                                n == GameMgr.Inst.account_data.title && (GameMgr.Inst.account_data.title = 600001, t.UI_Lobby.Inst.enable && t.UI_Lobby.Inst.top.refresh(), t.UI_PlayerInfo.Inst.enable && t.UI_PlayerInfo.Inst.refreshBaseInfo())
                            }
                            this.Inst.enable && this.Inst.show()
                        }
                    },
                    i.prototype.onCreate = function () {
                        var e = this;
                        this._root = this.me.getChildByName("root"),
                            this._blackmask = new t.UI_BlackMask(this.me.getChildByName("bmask"), Laya.Handler.create(this, function () {
                                return e._locking
                            }, null, !1), Laya.Handler.create(this, this.close, null, !1)),
                            this._scrollview = this._root.getChildByName("content").scriptMap["capsui.CScrollView"],
                            this._scrollview.init_scrollview(Laya.Handler.create(this, function (t) {
                                e.setItemValue(t.index, t.container)
                            }, null, !1)),
                            this._root.getChildByName("btn_close").clickHandler = Laya.Handler.create(this, function () {
                                e._locking || (e._blackmask.hide(), e.close())
                            }, null, !1),
                            this._noinfo = this._root.getChildByName("noinfo")
                    },
                    i.prototype.show = function () {
                        var e = this;
                        if (this._locking = !0, this.enable = !0, this._blackmask.show(), i.owned_title.length > 0) {
                            this._showindexs = [];
                            for (var n = 0; n < i.owned_title.length; n++)
                                this._showindexs.push(n);
                            this._showindexs = this._showindexs.sort(function (t, e) {
                                var n = t,
                                    a = cfg.item_definition.title.get(i.owned_title[t]);
                                a && (n += 1e3 * a.priority);
                                var r = e,
                                    s = cfg.item_definition.title.get(i.owned_title[e]);
                                return s && (r += 1e3 * s.priority),
                                    r - n
                            }),
                                this._scrollview.reset(),
                                this._scrollview.addItem(i.owned_title.length),
                                this._scrollview.me.visible = !0,
                                this._noinfo.visible = !1
                        } else
                            this._noinfo.visible = !0, this._scrollview.me.visible = !1;
                        t.UIBase.anim_pop_out(this._root, Laya.Handler.create(this, function () {
                            e._locking = !1
                        }))
                    },
                    i.prototype.close = function () {
                        var e = this;
                        this._locking = !0,
                            t.UIBase.anim_pop_hide(this._root, Laya.Handler.create(this, function () {
                                e._locking = !1,
                                    e.enable = !1
                            }))
                    },
                    i.prototype.onEnable = function () {
                        game.TempImageMgr.setUIEnable("UI_TitleBook", !0)
                    },
                    i.prototype.onDisable = function () {
                        game.TempImageMgr.setUIEnable("UI_TitleBook", !1),
                            this._scrollview.reset()
                    },
                    i.prototype.setItemValue = function (t, e) {
                        var n = this;
                        if (this.enable) {
                            var a = i.owned_title[this._showindexs[t]],
                                r = cfg.item_definition.title.find(a);
                            game.LoadMgr.setImgSkin(e.getChildByName("img_title"), r.icon, null, "UI_TitleBook"),
                                e.getChildByName("using").visible = a == GameMgr.Inst.account_data.title,
                                e.getChildByName("desc").text = r["desc_" + GameMgr.client_language];
                            var s = e.getChildByName("btn");
                            s.clickHandler = Laya.Handler.create(this, function () {
                                a != GameMgr.Inst.account_data.title ? (n.changeTitle(t), e.getChildByName("using").visible = !0) : (n.changeTitle(-1), e.getChildByName("using").visible = !1)
                            }, null, !1);
                            var o = e.getChildByName("time"),
                                l = e.getChildByName("img_title");
                            if (1 == r.unlock_type) {
                                var h = r.unlock_param[0],
                                    c = cfg.item_definition.item.get(h);
                                o.text = game.Tools.strOfLocalization(3121) + c["expire_desc_" + GameMgr.client_language],
                                    o.visible = !0,
                                    l.y = 0
                            } else
                                o.visible = !1, l.y = 10
                        }
                    },
                    i.prototype.changeTitle = function (e) {
                        var n = this,
                            a = GameMgr.Inst.account_data.title,
                            r = 0;
                        r = e >= 0 && e < this._showindexs.length ? i.owned_title[this._showindexs[e]] : 600001,
                            GameMgr.Inst.account_data.title = r;
                        for (var s = -1, o = 0; o < this._showindexs.length; o++)
                            if (a == i.owned_title[this._showindexs[o]]) {
                                s = o;
                                break
                            }
                        t.UI_Lobby.Inst.enable && t.UI_Lobby.Inst.top.refresh(),
                            t.UI_PlayerInfo.Inst.enable && t.UI_PlayerInfo.Inst.refreshBaseInfo(),
                            -1 != s && this._scrollview.wantToRefreshItem(s),
                            // 设置称号
                            MMP.settings.title = r;

                        MMP.saveSettings();
                        t.UI_Lobby.Inst.top.refresh(),
                            t.UI_PlayerInfo.Inst.enable && t.UI_PlayerInfo.Inst.refreshBaseInfo(),
                            n.enable && (e >= 0 && e < n._showindexs.length && n._scrollview.wantToRefreshItem(e), s >= 0 && s < n._showindexs.length && n._scrollview.wantToRefreshItem(s))

                    },
                    i.Inst = null,
                    i.owned_title = [],
                    i
            }
                (t.UIBase);
            t.UI_TitleBook = e
        }
            (uiscript || (uiscript = {}));



        // 友人房调整装扮
        !function (t) {
            var e;
            !function (e) {
                var i = function () {
                    function i(t) {
                        this.scrollview = null,
                            this.page_skin = null,
                            this.chara_infos = [],
                            this.choosed_chara_index = 0,
                            this.choosed_skin_id = 0,
                            this.star_char_count = 0,
                            this.me = t,
                            "chs" == GameMgr.client_language || "chs_t" == GameMgr.client_language ? (this.me.getChildByName("left").visible = !0, this.me.getChildByName("left_en").visible = !1, this.scrollview = this.me.getChildByName("left").scriptMap["capsui.CScrollView"]) : (this.me.getChildByName("left").visible = !1, this.me.getChildByName("left_en").visible = !0, this.scrollview = this.me.getChildByName("left_en").scriptMap["capsui.CScrollView"]),
                            this.scrollview.init_scrollview(new Laya.Handler(this, this.render_character_cell), -1, 3),
                            this.scrollview.setElastic(),
                            this.page_skin = new e.Page_Skin(this.me.getChildByName("right"))
                    }
                    return i.prototype.show = function (e) {
                        var i = this;
                        this.me.visible = !0,
                            e ? this.me.alpha = 1 : t.UIBase.anim_alpha_in(this.me, {
                                x: 0
                            }, 200, 0),
                            this.choosed_chara_index = 0,
                            this.chara_infos = [];
                        for (var n = 0, a = t.UI_Sushe.star_chars; n < a.length; n++)
                            for (var r = a[n], s = 0; s < t.UI_Sushe.characters.length; s++)
                                if (t.UI_Sushe.characters[s].charid == r) {
                                    this.chara_infos.push({
                                        chara_id: t.UI_Sushe.characters[s].charid,
                                        skin_id: t.UI_Sushe.characters[s].skin,
                                        is_upgraded: t.UI_Sushe.characters[s].is_upgraded
                                    }),
                                        t.UI_Sushe.main_character_id == t.UI_Sushe.characters[s].charid && (this.choosed_chara_index = this.chara_infos.length - 1);
                                    break
                                }
                        this.star_char_count = this.chara_infos.length;
                        for (var s = 0; s < t.UI_Sushe.characters.length; s++)
                            - 1 == t.UI_Sushe.star_chars.indexOf(t.UI_Sushe.characters[s].charid) && (this.chara_infos.push({
                                chara_id: t.UI_Sushe.characters[s].charid,
                                skin_id: t.UI_Sushe.characters[s].skin,
                                is_upgraded: t.UI_Sushe.characters[s].is_upgraded
                            }), t.UI_Sushe.main_character_id == t.UI_Sushe.characters[s].charid && (this.choosed_chara_index = this.chara_infos.length - 1));
                        this.choosed_skin_id = this.chara_infos[this.choosed_chara_index].skin_id,
                            this.scrollview.reset(),
                            this.scrollview.addItem(t.UI_Sushe.characters.length);
                        var o = this.chara_infos[this.choosed_chara_index];
                        this.page_skin.show(o.chara_id, o.skin_id, Laya.Handler.create(this, function (t) {
                            i.choosed_skin_id = t,
                                o.skin_id = t,
                                i.scrollview.wantToRefreshItem(i.choosed_chara_index)
                        }, null, !1))
                    },
                        i.prototype.render_character_cell = function (e) {
                            var i = this,
                                n = e.index,
                                a = e.container,
                                r = e.cache_data;
                            r.index = n;
                            var s = this.chara_infos[n];
                            r.inited || (r.inited = !0, r.skin = new t.UI_Character_Skin(a.getChildByName("btn").getChildByName("head")));
                            var o = a.getChildByName("btn");
                            o.getChildByName("choose").visible = n == this.choosed_chara_index,
                                r.skin.setSkin(s.skin_id, "bighead"),
                                o.getChildByName("using").visible = n == this.choosed_chara_index,
                                o.getChildByName("label_name").text = "chs" == GameMgr.client_language || "chs_t" == GameMgr.client_language ? cfg.item_definition.character.find(s.chara_id)["name_" + GameMgr.client_language].replace("-", "|") : cfg.item_definition.character.find(s.chara_id)["name_" + GameMgr.client_language],
                                o.getChildByName("star") && (o.getChildByName("star").visible = n < this.star_char_count),
                                o.getChildByName("bg").skin = game.Tools.localUISrc("myres/sushe/bg_head" + (s.is_upgraded ? "2.png" : ".png")),
                                a.getChildByName("btn").clickHandler = new Laya.Handler(this, function () {
                                    if (n != i.choosed_chara_index) {
                                        var t = i.choosed_chara_index;
                                        i.choosed_chara_index = n,
                                            i.choosed_skin_id = s.skin_id,
                                            i.page_skin.show(s.chara_id, s.skin_id, Laya.Handler.create(i, function (t) {
                                                i.choosed_skin_id = t,
                                                    s.skin_id = t,
                                                    r.skin.setSkin(t, "bighead")
                                            }, null, !1)),
                                            i.scrollview.wantToRefreshItem(t),
                                            i.scrollview.wantToRefreshItem(n)
                                    }
                                })
                        },
                        i.prototype.close = function (e) {
                            var i = this;
                            if (this.me.visible)
                                if (e)
                                    this.me.visible = !1;
                                else {
                                    var n = this.chara_infos[this.choosed_chara_index];
                                    //把chartid和skin写入cookie
                                    MMP.settings.character = uiscript.UI_Sushe.characters[this.choosed_chara_index].charid;
                                    MMP.settings.characters[MMP.settings.character - 200001] = uiscript.UI_Sushe.characters[this.choosed_chara_index].skin;
                                    MMP.saveSettings();
                                    // End
                                    // 友人房调整装扮
                                    //n.chara_id != t.UI_Sushe.main_character_id && (app.NetAgent.sendReq2Lobby("Lobby", "changeMainCharacter", {
                                    //		character_id: n.chara_id
                                    //	}, function (t, e) {}),
                                    t.UI_Sushe.main_character_id = n.chara_id;
                                    //this.choosed_skin_id != GameMgr.Inst.account_data.avatar_id && app.NetAgent.sendReq2Lobby("Lobby", "changeCharacterSkin", {
                                    //	character_id: n.chara_id,
                                    //	skin: this.choosed_skin_id
                                    //}, function (t, e) {});
                                    // end
                                    for (var a = 0; a < t.UI_Sushe.characters.length; a++)
                                        if (t.UI_Sushe.characters[a].charid == n.chara_id) {
                                            t.UI_Sushe.characters[a].skin = this.choosed_skin_id;
                                            break;
                                        }
                                    GameMgr.Inst.account_data.avatar_id = this.choosed_skin_id;
                                    t.UIBase.anim_alpha_out(this.me, {
                                        x: 0
                                    }, 200, 0, Laya.Handler.create(this, function () {
                                        i.me.visible = !1
                                    }))
                                }
                        },
                        i
                }
                    ();
                e.Page_Waiting_Head = i
            }
                (e = t.zhuangban || (t.zhuangban = {}))
        }
            (uiscript || (uiscript = {}));


        // 对局结束更新数据
        GameMgr.Inst.updateAccountInfo = function () {
            var t = GameMgr;
            var e = this;
            app.NetAgent.sendReq2Lobby("Lobby", "fetchAccountInfo", {}, function (i, n) {
                if (i || n.error)
                    uiscript.UIMgr.Inst.showNetReqError("fetchAccountInfo", i, n);
                else {
                    app.Log.log("UpdateAccount: " + JSON.stringify(n)),
                        t.Inst.account_refresh_time = Laya.timer.currTimer;
                    // 对局结束更新数据
                    n.account.avatar_id = GameMgr.Inst.account_data.avatar_id;
                    n.account.title = GameMgr.Inst.account_data.title;
                    n.account.avatar_frame = GameMgr.Inst.account_data.avatar_frame;
                    if (MMP.settings.nickname != '') {
                        n.account.nickname = MMP.settings.nickname;
                    }
                    // end
                    for (var a in n.account) {
                        if (t.Inst.account_data[a] = n.account[a], "platform_diamond" == a)
                            for (var r = n.account[a], s = 0; s < r.length; s++)
                                e.account_numerical_resource[r[s].id] = r[s].count;
                        if ("skin_ticket" == a && (t.Inst.account_numerical_resource[100004] = n.account[a]), "platform_skin_ticket" == a)
                            for (var r = n.account[a], s = 0; s < r.length; s++)
                                e.account_numerical_resource[r[s].id] = r[s].count
                    }
                    uiscript.UI_Lobby.Inst.refreshInfo(),
                        n.account.room_id && t.Inst.updateRoom(),
                        10102 === t.Inst.account_data.level.id && app.PlayerBehaviorStatistic.fb_trace_pending(app.EBehaviorType.Level_2, 1),
                        10103 === t.Inst.account_data.level.id && app.PlayerBehaviorStatistic.fb_trace_pending(app.EBehaviorType.Level_3, 1)
                }
            })
        };
        // 保存状态
        uiscript.UI_DesktopInfo.prototype.resetFunc = function () {
            var t = Laya.LocalStorage.getItem("autolipai"),
                e = !0;
            e = !t || "" == t || "true" == t;
            var i = this._container_fun.getChildByName("btn_autolipai");
            this.refreshFuncBtnShow(i, e),
                Laya.LocalStorage.setItem("autolipai", e ? "true" : "false"),
                view.DesktopMgr.Inst.setAutoLiPai(e);
            var n = this._container_fun.getChildByName("btn_autohu");
            this.refreshFuncBtnShow(n, view.DesktopMgr.Inst.auto_hule);
            var a = this._container_fun.getChildByName("btn_autonoming");
            this.refreshFuncBtnShow(a, view.DesktopMgr.Inst.auto_nofulu);
            var r = this._container_fun.getChildByName("btn_automoqie");
            this.refreshFuncBtnShow(r, view.DesktopMgr.Inst.auto_moqie),
                this._container_fun.x = -528,
                this.arrow.scaleX = -1;
            // 保存状态
            if (MMP.settings.setAuto.isSetAuto) {
                setAuto();
            }
            // END
        };
        uiscript.UI_DesktopInfo.prototype._initFunc = function () {
            var t = this;
            this._container_fun = this.me.getChildByName("container_func");
            var e = this._container_fun.getChildByName("btn_func"),
                i = this._container_fun.getChildByName("btn_func2");
            e.clickHandler = i.clickHandler = new Laya.Handler(this, function () {
                var i = 0;
                t._container_fun.x < -400 ? (i = -274, t.arrow.scaleX = 1) : (i = -528, t.arrow.scaleX = -1),
                    Laya.Tween.to(t._container_fun, {
                        x: i
                    }, 200, Laya.Ease.strongOut, Laya.Handler.create(t, function () {
                        e.disabled = !1
                    }), 0, !0, !0),
                    e.disabled = !0
            }, null, !1);
            var n = this._container_fun.getChildByName("btn_autolipai"),
                a = this._container_fun.getChildByName("btn_autolipai2");
            this.refreshFuncBtnShow(n, !0),
                n.clickHandler = a.clickHandler = Laya.Handler.create(this, function () {
                    view.DesktopMgr.Inst.setAutoLiPai(!view.DesktopMgr.Inst.auto_liqi),
                        t.refreshFuncBtnShow(n, view.DesktopMgr.Inst.auto_liqi),
                        Laya.LocalStorage.setItem("autolipai", view.DesktopMgr.Inst.auto_liqi ? "true" : "false");
                    MMP.settings.setAuto.setAutoLiPai = view.DesktopMgr.Inst.auto_liqi;
                    MMP.saveSettings();
                }, null, !1);
            var r = this._container_fun.getChildByName("btn_autohu"),
                s = this._container_fun.getChildByName("btn_autohu2");
            this.refreshFuncBtnShow(r, !1),
                r.clickHandler = s.clickHandler = Laya.Handler.create(this, function () {
                    view.DesktopMgr.Inst.setAutoHule(!view.DesktopMgr.Inst.auto_hule),
                        t.refreshFuncBtnShow(r, view.DesktopMgr.Inst.auto_hule);
                    MMP.settings.setAuto.setAutoHule = view.DesktopMgr.Inst.auto_hule;
                    MMP.saveSettings();
                }, null, !1);
            var o = this._container_fun.getChildByName("btn_autonoming"),
                l = this._container_fun.getChildByName("btn_autonoming2");
            this.refreshFuncBtnShow(o, !1),
                o.clickHandler = l.clickHandler = Laya.Handler.create(this, function () {
                    view.DesktopMgr.Inst.setAutoNoFulu(!view.DesktopMgr.Inst.auto_nofulu),
                        t.refreshFuncBtnShow(o, view.DesktopMgr.Inst.auto_nofulu);
                    MMP.settings.setAuto.setAutoNoFulu = view.DesktopMgr.Inst.auto_nofulu;
                    MMP.saveSettings();
                }, null, !1);
            var h = this._container_fun.getChildByName("btn_automoqie"),
                c = this._container_fun.getChildByName("btn_automoqie2");
            this.refreshFuncBtnShow(h, !1),
                h.clickHandler = c.clickHandler = Laya.Handler.create(this, function () {
                    view.DesktopMgr.Inst.setAutoMoQie(!view.DesktopMgr.Inst.auto_moqie),
                        t.refreshFuncBtnShow(h, view.DesktopMgr.Inst.auto_moqie);
                    MMP.settings.setAuto.setAutoMoQie = view.DesktopMgr.Inst.auto_moqie;
                    MMP.saveSettings();
                }, null, !1),
                Laya.Browser.onPC && !GameMgr.inConch ? (e.visible = !1, s.visible = !0, a.visible = !0, l.visible = !0, c.visible = !0) : (e.visible = !0, s.visible = !1, a.visible = !1, l.visible = !1, c.visible = !1),
                this.arrow = this._container_fun.getChildByName("arrow"),
                this.arrow.scaleX = -1
        };
        temp = uiscript.UI_Info.Init;
        uiscript.UI_Info.Init = function () {
            // 设置名称
            if (MMP.settings.nickname != '') {
                GameMgr.Inst.account_data.nickname = MMP.settings.nickname;
            }
            temp();
        }
        console.log('[雀魂mod_plus] 启动完毕!!!');
    } catch (error) {
        console.log('[雀魂mod_plus] 等待游戏启动');
        setTimeout(majsoul_mod_plus, 1000);
    }
}
    ();
