import { createRoot } from "react-dom/client";
import "./index.css";
import "./utils/theme-transition";

const mountRoot = (el: HTMLElement) => {
	const root = createRoot(el);
	return {
		render: (node: any) => root.render(node),
	};
};

const showError = (err: unknown) => {
	// Basic visible error UI so users on the deployed site see the problem
	const el = document.getElementById("root")!;
	el.innerHTML = `
		<div style="font-family:system-ui,Segoe UI,Helvetica,Arial;display:flex;align-items:center;justify-content:center;height:100vh;padding:20px;box-sizing:border-box;">
			<div style="max-width:720px;border:1px solid #eee;padding:24px;border-radius:12px;background:#fff;color:#111;box-shadow:0 6px 24px rgba(0,0,0,0.06);">
				<h2 style="margin:0 0 12px;font-size:18px">Une erreur est survenue</h2>
				<pre style="white-space:pre-wrap;margin:0;color:#b91c1c">${String(err)}</pre>
				<p style="margin-top:12px;color:#444">Ouvre la console du navigateur (F12) pour voir les détails.</p>
			</div>
		</div>
	`;
	// also log to console
	console.error("App mounting error:", err);
};

// Try to dynamically import the app so we can catch initialization errors
const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

console.log("App: starting dynamic import");
import("./App")
	.then((module) => {
		const App = module.default;
		try {
			const r = mountRoot(rootEl);
			r.render( /*#__PURE__*/ (App as any) && /*#__PURE__*/ (App as any)());
		} catch (err) {
			showError(err);
		}
	})
	.catch((err) => {
		showError(err);
	});
