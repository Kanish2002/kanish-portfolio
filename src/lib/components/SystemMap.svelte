<div class="system-map" aria-label="Decorative event flow between abstract backend services">
	<div class="map-head">
		<span>EVENT FLOW / 07</span>
		<span>p95 · steady</span>
	</div>
	<div class="architecture" aria-hidden="true">
		<svg viewBox="0 0 600 420" role="presentation">
			<defs>
				<linearGradient id="flow" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stop-color="#43d9ff" stop-opacity="0.15" />
					<stop offset="0.5" stop-color="#43d9ff" />
					<stop offset="1" stop-color="#f5b84b" stop-opacity="0.3" />
				</linearGradient>
			</defs>
			<path class="route" d="M104 76 H287 Q310 76 310 99 V183 H486" />
			<path class="route secondary-route" d="M105 218 H198 Q225 218 225 245 V335 H485" />
			<path class="route" d="M310 183 V283 Q310 305 333 305 H488" />
			<circle class="packet p1" cx="0" cy="0" r="5" />
			<circle class="packet amber p2" cx="0" cy="0" r="5" />
			<circle class="packet p3" cx="0" cy="0" r="4" />
		</svg>
		<div class="node n-api"><small>01</small><strong>API Gateway</strong><span>request ingress</span></div>
		<div class="node n-order"><small>02</small><strong>Order Service</strong><span>state + rules</span></div>
		<div class="node n-kafka hot"><small>03</small><strong>Kafka</strong><span>event stream</span></div>
		<div class="node n-exec"><small>04</small><strong>Execution</strong><span>order routing</span></div>
		<div class="node n-wallet"><small>05</small><strong>Wallet</strong><span>balance ledger</span></div>
		<div class="node n-settle"><small>06</small><strong>Settlement</strong><span>finality</span></div>
	</div>
	<div class="map-foot"><span>events flowing</span><span>retries bounded</span><span>services healthy</span></div>
</div>
