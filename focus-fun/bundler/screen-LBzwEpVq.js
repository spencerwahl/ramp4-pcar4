import { defineComponent as L, defineAsyncComponent as u, inject as b, ref as w, onMounted as C, onBeforeUnmount as A, computed as B, resolveComponent as F, resolveDirective as p, createBlock as a, openBlock as o, withCtx as d, createVNode as D, withDirectives as T, unref as r, createElementBlock as m, Fragment as j, renderList as N, createTextVNode as V, toDisplayString as q } from "vue";
import { useI18n as H } from "vue-i18n";
const M = ["content"], W = /* @__PURE__ */ L({
  __name: "screen",
  props: {
    panel: {
      type: Object,
      required: !0
    }
  },
  setup(v) {
    const f = u(() => import("./header-BVaoz83b.js")), _ = u(() => import("./item-DTB164Ov.js")), { t: s } = H(), g = b("iApi"), e = w(), c = () => {
      e.value._tippy.hide();
    }, i = (t) => {
      t.key === "Tab" && e.value?.matches(":focus") && e.value._tippy.show();
    }, y = (t) => {
      const n = new CustomEvent("switchFocusItem", { detail: { focusItem: t } });
      e.value?.dispatchEvent(n);
    };
    C(() => {
      e.value?.addEventListener("blur", c), e.value?.addEventListener("keyup", i);
    }), A(() => {
      e.value?.removeEventListener("blur", c), e.value?.removeEventListener("keyup", i);
    });
    const h = B(() => {
      const t = g.fixture.get("legend");
      return t ? [...t.getLegend()] : [];
    });
    return (t, n) => {
      const E = F("panel-screen"), k = p("focus-list"), I = p("tippy");
      return o(), a(E, { panel: v.panel }, {
        header: d(() => [
          V(q(r(s)("legend.title")), 1)
        ]),
        content: d(() => [
          D(r(f)),
          T((o(), m("div", {
            content: r(s)("panels.controls.items"),
            ref_key: "el",
            ref: e
          }, [
            (o(!0), m(j, null, N(h.value, (l) => (o(), a(r(_), {
              legendItem: l,
              key: l.uid,
              onFocusItem: n[0] || (n[0] = (x, O) => y(x))
            }, null, 8, ["legendItem"]))), 128))
          ], 8, M)), [
            [k],
            [I, {
              trigger: "manual",
              placement: "top-end",
              touch: !1,
              maxWidth: 190
            }]
          ])
        ]),
        _: 1
      }, 8, ["panel"]);
    };
  }
});
export {
  W as default
};
