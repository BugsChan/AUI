import { computed as _, createElementBlock as m, openBlock as v, normalizeStyle as L, normalizeClass as A, createCommentVNode as I, toDisplayString as b, ref as g, onMounted as T, watch as S, nextTick as k, createElementVNode as s, Fragment as W, renderList as N, renderSlot as G, createStaticVNode as Q, withDirectives as E, withKeys as Z, vModelText as M, createVNode as R, withCtx as ee, createApp as te } from "vue";
const V = (n, i) => {
  const c = n.__vccOpts || n;
  for (const [l, e] of i)
    c[l] = e;
  return c;
}, oe = ["src", "alt"], ie = {
  key: 2,
  class: "aui-icon-tooltip"
}, ne = {
  __name: "aui-icon",
  props: {
    iconConfig: {
      type: Object,
      default: () => ({
        path: "",
        width: 32,
        height: 32,
        position: "bottom-right",
        description: ""
      })
    }
  },
  emits: ["click"],
  setup(n, { emit: i }) {
    const c = n, l = i, e = _(() => {
      const p = window.innerWidth <= 768;
      let r = c.iconConfig.position || "bottom-right";
      return p && (r = c.iconConfig.position || "bottom-center"), `aui-icon-${r}`;
    }), d = () => {
      l("click");
    };
    return (p, r) => (v(), m("div", {
      class: A(["aui-icon-container", e.value]),
      onClick: d,
      style: L({
        "--icon-width": `${n.iconConfig.width || 32}px`,
        "--icon-height": `${n.iconConfig.height || 32}px`
      })
    }, [
      n.iconConfig.path ? (v(), m("img", {
        key: 0,
        src: n.iconConfig.path,
        alt: n.iconConfig.description || "AI Assistant",
        style: L({
          width: `${n.iconConfig.width || 32}px`,
          height: `${n.iconConfig.height || 32}px`
        }),
        class: "aui-icon-img"
      }, null, 12, oe)) : (v(), m("div", {
        key: 1,
        class: "aui-icon-default",
        style: L({
          width: `${n.iconConfig.width || 32}px`,
          height: `${n.iconConfig.height || 32}px`
        })
      }, " AI ", 4)),
      n.iconConfig.description ? (v(), m("div", ie, b(n.iconConfig.description), 1)) : I("", !0)
    ], 6));
  }
}, se = /* @__PURE__ */ V(ne, [["__scopeId", "data-v-4e02fcf6"]]), ae = { class: "aui-window-title" }, le = {
  key: 1,
  class: "aui-window-header-mobile"
}, ce = { class: "aui-window-title" }, de = { class: "aui-messages" }, re = { class: "aui-message-content" }, ue = { key: 1 }, pe = {
  key: 0,
  class: "aui-message ai"
}, me = { class: "aui-window-input-container" }, ve = { class: "aui-input-wrapper" }, he = ["placeholder"], ge = {
  __name: "aui-win",
  props: {
    visible: {
      type: Boolean,
      default: !1
    },
    windowConfig: {
      type: Object,
      default: () => ({
        width: 300,
        height: 400,
        position: "bottom-right",
        description: "",
        placeholder: ""
      })
    }
  },
  emits: ["close", "send-message"],
  setup(n, { expose: i, emit: c }) {
    const l = n, e = c, d = g(null), p = g(null), r = g(!1), w = g(""), x = g(!1), t = g([]), o = g(!1), a = g(!1), h = g({ x: 0, y: 0 }), f = g({ x: 0, y: 0 });
    T(() => {
      O(), window.addEventListener("resize", O), window.addEventListener("mousemove", B), window.addEventListener("mouseup", z);
    });
    const O = () => {
      r.value = window.innerWidth <= 768, r.value ? f.value = { x: 0, y: 0 } : f.value = {
        x: window.innerWidth - (l.windowConfig.width || 300) - 40,
        y: window.innerHeight - (l.windowConfig.height || 400) - 100
      };
    }, H = _(() => {
      const u = {};
      return r.value ? (u.width = "100%", u.height = "300px") : (u.width = `${l.windowConfig.width || 300}px`, u.height = `${l.windowConfig.height || 400}px`, u.left = `${f.value.x}px`, u.top = `${f.value.y}px`), u;
    }), q = (u) => {
      r.value || (a.value = !0, h.value = {
        x: u.clientX - f.value.x,
        y: u.clientY - f.value.y
      });
    }, B = (u) => {
      !a.value || r.value || (f.value = {
        x: u.clientX - h.value.x,
        y: u.clientY - h.value.y
      });
    }, z = () => {
      a.value = !1;
    }, U = () => {
      e("close");
    }, K = (u) => {
      t.value.push({
        type: "message",
        sender: "ai",
        content: u
      }), o.value = !1, k(() => {
        $();
      });
    }, F = (u, C = {}) => {
      const y = {
        ...u,
        // 将参数对象添加到卡片数据中
        _params: C
      };
      t.value.push({
        type: "card",
        data: y
      }), o.value = !1, k(() => {
        $();
      });
    }, D = () => {
      if (!w.value.trim()) return;
      t.value.push({
        type: "message",
        sender: "user",
        content: w.value
      }), o.value = !0;
      const u = w.value;
      w.value = "", k(() => {
        $();
      }), e("send-message", u);
    }, J = () => {
    }, X = (u) => {
      console.log("Card confirmed:", u);
    }, $ = () => {
      p.value && (p.value.scrollTop = p.value.scrollHeight);
    };
    return S(t, () => {
      k(() => {
        $();
      });
    }), S(o, () => {
      k(() => {
        $();
      });
    }), i({
      replyMessage: K,
      replyCard: F
    }), (u, C) => n.visible ? (v(), m("div", {
      key: 0,
      class: A(["aui-window-container", { "aui-window-mobile": r.value }]),
      style: L(H.value),
      ref_key: "windowRef",
      ref: d
    }, [
      r.value ? (v(), m("div", le, [
        s("div", ce, b(n.windowConfig.description || "AI Assistant"), 1),
        s("button", {
          class: "aui-window-close",
          onClick: U
        }, "×")
      ])) : (v(), m("div", {
        key: 0,
        class: "aui-window-header",
        onMousedown: q
      }, [
        s("div", ae, b(n.windowConfig.description || "AI Assistant"), 1),
        s("button", {
          class: "aui-window-close",
          onClick: U
        }, "×")
      ], 32)),
      s("div", {
        class: "aui-window-content",
        ref_key: "contentRef",
        ref: p
      }, [
        s("div", de, [
          C[2] || (C[2] = s("div", { class: "aui-message system" }, [
            s("div", { class: "aui-message-content" }, " 你好！我是AI助手，有什么可以帮助你的吗？ ")
          ], -1)),
          (v(!0), m(W, null, N(t.value, (y, Y) => (v(), m(W, { key: Y }, [
            y.type === "message" ? (v(), m("div", {
              key: 0,
              class: A(["aui-message", y.sender])
            }, [
              s("div", re, b(y.content), 1)
            ], 2)) : y.type === "card" ? (v(), m("div", ue, [
              G(u.$slots, "card", {
                card: y.data,
                onConfirm: X
              }, void 0, !0)
            ])) : I("", !0)
          ], 64))), 128)),
          o.value ? (v(), m("div", pe, [...C[1] || (C[1] = [
            Q('<div class="aui-message-content" data-v-a23157d9><div class="aui-loading" data-v-a23157d9><div class="aui-loading-dot" data-v-a23157d9></div><div class="aui-loading-dot" data-v-a23157d9></div><div class="aui-loading-dot" data-v-a23157d9></div></div></div>', 1)
          ])])) : I("", !0)
        ])
      ], 512),
      s("div", me, [
        s("div", ve, [
          s("button", {
            class: "aui-voice-btn",
            onClick: J
          }, b(x.value ? "🔴" : "🎤"), 1),
          E(s("input", {
            type: "text",
            class: "aui-input",
            placeholder: n.windowConfig.placeholder || "请输入您的问题...",
            "onUpdate:modelValue": C[0] || (C[0] = (y) => w.value = y),
            onKeyup: Z(D, ["enter"])
          }, null, 40, he), [
            [M, w.value]
          ]),
          s("button", {
            class: "aui-send-btn",
            onClick: D
          }, " ➤ ")
        ])
      ])
    ], 6)) : I("", !0);
  }
}, fe = /* @__PURE__ */ V(ge, [["__scopeId", "data-v-a23157d9"]]), we = { class: "aui-card-attention" }, ye = { class: "aui-card-image-container" }, Ce = ["innerHTML"], be = ["src"], _e = {
  key: 2,
  class: "aui-card-image-placeholder"
}, xe = { class: "aui-card-inputs" }, $e = ["for"], ke = ["id", "onUpdate:modelValue", "placeholder"], Ie = {
  key: 1,
  class: "aui-journey-inputs"
}, Le = { class: "aui-input-group" }, Ee = { class: "aui-input-group" }, Me = {
  __name: "aui-card",
  props: {
    cardConfig: {
      type: Object,
      required: !0,
      default: () => ({
        description: "",
        method: null,
        params: [],
        ui: {
          type: "button",
          cardImg: null,
          attention: ""
        }
      })
    }
  },
  emits: ["confirm"],
  setup(n, { emit: i }) {
    const c = n, l = i, e = g({}), d = _(() => {
      const t = c.cardConfig.ui;
      return typeof t == "function" ? t() : t || {
        type: "button",
        cardImg: null,
        attention: ""
      };
    });
    S(() => c.cardConfig, (t) => {
      if (t.params) {
        const o = {}, a = t._params || {};
        t.params.forEach((h) => {
          o[h.name] = a[h.name] !== void 0 ? a[h.name] : "";
        }), e.value = o;
      }
    }, { immediate: !0, deep: !0 });
    const p = (t) => typeof t == "string" && (t.trim().startsWith("<svg") || t.trim().startsWith("data:image/svg+xml")), r = _(() => {
      const t = d.value.cardImg;
      if (!t) return null;
      if (t.startsWith("$")) {
        const o = t.slice(1);
        return e.value[o] || null;
      }
      return t;
    }), w = _(() => {
      const t = r.value;
      return t ? p(t) : !1;
    }), x = () => {
      const t = [];
      if (console.log(c.cardConfig), d.value.type === "journey") {
        const o = d.value.start || "start", a = d.value.end || "end";
        t.push(e.value[o], e.value[a]);
      } else c.cardConfig.params && c.cardConfig.params.forEach((o) => {
        t.push(e.value[o.name]);
      });
      l("confirm", {
        method: c.cardConfig.method,
        params: t,
        paramValues: e.value
      });
    };
    return (t, o) => (v(), m("div", {
      class: A(["aui-card", d.value.type])
    }, [
      s("div", we, b(d.value.attention || "请确认操作"), 1),
      s("div", ye, [
        w.value ? (v(), m("div", {
          key: 0,
          class: "aui-card-svg",
          innerHTML: r.value
        }, null, 8, Ce)) : r.value ? (v(), m("img", {
          key: 1,
          src: r.value,
          alt: "Card Image",
          class: "aui-card-image"
        }, null, 8, be)) : (v(), m("div", _e, [...o[2] || (o[2] = [
          s("div", { class: "aui-placeholder-icon" }, "📷", -1),
          s("div", { class: "aui-placeholder-text" }, "暂无图片", -1)
        ])]))
      ]),
      s("div", xe, [
        d.value.type === "input" ? (v(!0), m(W, { key: 0 }, N(n.cardConfig.params.filter((a) => !a.hidden), (a, h) => (v(), m("div", {
          key: h,
          class: "aui-input-group"
        }, [
          s("label", {
            for: "param-" + h,
            class: "aui-input-label"
          }, b(a.description), 9, $e),
          E(s("input", {
            id: "param-" + h,
            type: "text",
            class: "aui-card-input",
            "onUpdate:modelValue": (f) => e.value[a.name] = f,
            placeholder: "请输入" + a.name
          }, null, 8, ke), [
            [M, e.value[a.name]]
          ])
        ]))), 128)) : d.value.type === "journey" ? (v(), m("div", Ie, [
          s("div", Le, [
            o[3] || (o[3] = s("label", { class: "aui-input-label" }, "起始位置", -1)),
            E(s("input", {
              type: "text",
              class: "aui-card-input",
              "onUpdate:modelValue": o[0] || (o[0] = (a) => e.value[d.value.start || "start"] = a),
              placeholder: "请输入起始位置"
            }, null, 512), [
              [M, e.value[d.value.start || "start"]]
            ])
          ]),
          o[5] || (o[5] = s("div", { class: "aui-journey-arrow" }, "↓", -1)),
          s("div", Ee, [
            o[4] || (o[4] = s("label", { class: "aui-input-label" }, "目的地", -1)),
            E(s("input", {
              type: "text",
              class: "aui-card-input",
              "onUpdate:modelValue": o[1] || (o[1] = (a) => e.value[d.value.end || "end"] = a),
              placeholder: "请输入目的地"
            }, null, 512), [
              [M, e.value[d.value.end || "end"]]
            ])
          ])
        ])) : I("", !0)
      ]),
      s("div", { class: "aui-card-actions" }, [
        s("button", {
          class: "aui-card-confirm",
          onClick: x
        }, " 确定 ")
      ])
    ], 2));
  }
}, Ae = /* @__PURE__ */ V(Me, [["__scopeId", "data-v-21017ea7"]]), P = "http://localhost:8080", Ve = "/loader.html", Re = `${P}${Ve}`, Se = async (n, i) => {
  try {
    return console.log(i), await Pe(n, i);
  } catch (c) {
    return console.error("LLM API error:", c), "Error: please retry later.";
  }
}, We = (n) => {
  let i = {};
  for (let l in n.methods)
    i[l] = {}, i[l].description = n.methods[l].description, i[l].params = n.methods[l].params;
  return `
  你是一个只输出 JSON 的 API 接口，不要输出任何解释性文字,
  严禁使用 \`\`\` 代码块包裹，严禁在 JSON 前后添加任何问候语.
  该网站的介绍为${n.introduction};
  可供选择的方法为 ${JSON.stringify(i)}
  你输出的json格式为：
  {
    "type": "method", // 可以是 method 或 text
    "method": "方法名", //当type为method时，必填
    "arguments": { //参数名和参数值, 该方法有参数时必填
      "参数名": "参数值"
    },
    "text": "普通文本回复" //当type为text时，必填
  }
  你可以根据用户的问题和上下文信息，选择合适的方法或直接回复文本,但回复文本也必须符合json格式
  `;
}, Pe = async (n, i) => new Promise((c, l) => {
  console.log("开始创建 iframe 请求");
  const e = document.createElement("iframe");
  e.style.display = "none", e.style.width = "0px", e.style.height = "0px", e.style.border = "none", e.src = Re;
  const d = (p) => {
    if (p.origin !== P) {
      console.log("消息来源不匹配，忽略:", p.origin);
      return;
    }
    const r = p.data;
    r.type === "response" && (console.log("收到响应:", r), window.removeEventListener("message", d), document.body.removeChild(e), r.success ? c(r.content) : l(new Error(r.content || "Request failed")));
  };
  window.addEventListener("message", d), e.onload = () => {
    try {
      const p = We(i);
      e.contentWindow.postMessage({
        type: "request",
        message: n,
        options: p,
        passKey: i.passKey
      }, P);
    } catch (p) {
      l(p), window.removeEventListener("message", d), document.body.removeChild(e);
    }
  }, e.onerror = (p) => {
    l(new Error("iframe loading failed")), window.removeEventListener("message", d), document.body.contains(e) && document.body.removeChild(e);
  }, document.body.appendChild(e), document.body.contains(e) || (console.error("iframe 未能成功添加到 DOM"), l(new Error("Failed to append iframe to DOM"))), setTimeout(() => {
    console.log("请求超时"), window.removeEventListener("message", d), document.body.contains(e) && document.body.removeChild(e), l(new Error("Request timeout"));
  }, 3e4);
}), Oe = { class: "aui-main-container" }, Ue = {
  __name: "aui-main",
  props: {
    options: {
      type: Object,
      default: () => ({})
    }
  },
  setup(n) {
    const i = n, c = g(null), l = g(!1);
    g([]);
    const e = _(() => ({
      icon: {
        path: i.options.icon?.path || "",
        width: i.options.icon?.width || 32,
        height: i.options.icon?.height || 32,
        position: i.options.icon?.position || "bottom-right",
        description: i.options.icon?.description || ""
      },
      window: {
        width: i.options.window?.width || 300,
        height: i.options.window?.height || 400,
        position: i.options.window?.position || "bottom-right",
        description: i.options.window?.description || "",
        placeholder: i.options.window?.placeholder || ""
      },
      description: i.options.description || "",
      methods: i.options.methods || {}
    })), d = () => {
      l.value = !l.value;
    }, p = () => {
      l.value = !1;
    }, r = async (t) => {
      console.log("Received message:", t);
      const o = e.value.methods, a = await Se(t, i.options);
      if (typeof a == "object" && c.value) {
        const h = o[a.method], f = a.arguments || {};
        c.value.replyCard(h, f);
      } else c.value && c.value.replyMessage(a);
    }, w = (t, o) => {
      console.log("Card confirmed:", t), x(t), o && o(t);
    }, x = (t) => {
      const { method: o, params: a } = t;
      console.log("cardData:"), console.log(t), typeof o == "function" ? o(...a || []) : typeof o == "string" && o.startsWith("http") ? window.location.href = o : console.error("Invalid method type:", o);
    };
    return T(() => {
      console.log("AUI initialized with config:", e.value);
    }), (t, o) => (v(), m("div", Oe, [
      R(se, {
        "icon-config": e.value.icon,
        onClick: d
      }, null, 8, ["icon-config"]),
      R(fe, {
        visible: l.value,
        "window-config": e.value.window,
        onClose: p,
        onSendMessage: r,
        ref_key: "winRef",
        ref: c
      }, {
        card: ee(({ card: a, onConfirm: h }) => [
          R(Ae, {
            "card-config": a,
            onConfirm: (f) => w(f, h)
          }, null, 8, ["card-config", "onConfirm"])
        ]),
        _: 1
      }, 8, ["visible", "window-config"])
    ]));
  }
}, j = /* @__PURE__ */ V(Ue, [["__scopeId", "data-v-37169f37"]]);
class De {
  constructor(i = {}) {
    this.options = i, this.app = null, this.mount();
  }
  mount() {
    const i = document.createElement("div");
    i.id = "aui-container", document.body.appendChild(i), this.app = te(j, {
      options: this.options
    }), this.app.mount("#aui-container");
  }
  // 提供一些公共方法
  show() {
    this.app && this.app.config.globalProperties.$emit("show");
  }
  hide() {
    this.app && this.app.config.globalProperties.$emit("hide");
  }
}
typeof window < "u" && (window.AUI = De, window.AUI.AuiMain = j);
export {
  j as AuiMain,
  De as default
};
