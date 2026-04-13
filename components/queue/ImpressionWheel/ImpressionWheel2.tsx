import { useState, useRef, useCallback, useEffect } from "react";

import { adjectives } from "../../../lib/def/adjectives";

const CAT_COUNT = 10;
const SUBS_PER_CAT = 9;
const CAT_COLORS = [
  "#378ADD","#1D9E75","#D85A30","#8B5FCF","#BA7517",
  "#C82D5A","#0F7A9E","#639922","#993556","#D05020",
];

const CX = 200, CY = 200;
const CAT_R = 110;
const SUB_R = 165;

function buildItems() {
  const items = [];
  for (let c = 0; c < CAT_COUNT; c++) {
    const baseAngle = (c / CAT_COUNT) * 360;
    items.push({ id: `C${c}`, label: adjectives[c], level: 1, catIdx: c, baseAngle });
    for (let s = 0; s < SUBS_PER_CAT; s++) {
      const labelIdx = CAT_COUNT + c * SUBS_PER_CAT + s;
      const spread = 360 / CAT_COUNT;
      const subAngle = baseAngle + ((s + 1) / (SUBS_PER_CAT + 1) - 0.5) * spread;
      items.push({
        id: `S${c}_${s}`,
        label: adjectives[labelIdx % adjectives.length],
        level: 2, catIdx: c, baseAngle: subAngle,
      });
    }
  }
  return items;
}

const ITEMS = buildItems();

function polarXY(angleDeg, r) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

// Key insight: screenAngle = baseAngle + rotation (mod 360)
// Item at 12 o'clock has screenAngle = 0. Find item closest to 0.
function findSelected(rotation, slowMode) {
  const pool = slowMode ? ITEMS : ITEMS.filter(i => i.level === 1);
  let best = null, bestDist = Infinity;
  pool.forEach(item => {
    const screenAngle = ((item.baseAngle + rotation) % 360 + 360) % 360;
    const dist = screenAngle > 180 ? 360 - screenAngle : screenAngle;
    if (dist < bestDist) { bestDist = dist; best = item.id; }
  });
  return best;
}

function WheelItem({ item, rotation, expansion, isSelected }) {
  const isCat = item.level === 1;
  const r = isCat ? CAT_R : SUB_R;
  const pos = polarXY(item.baseAngle, r);
  const color = CAT_COLORS[item.catIdx];
  const dotSize = isCat ? (isSelected ? 11 : 8) : (isSelected ? 7 : 4.5);

  const catLabelOpacity = expansion > 0.5 ? Math.max(0, 1 - (expansion - 0.5) * 2) : 1;
  const labelOpacity = isCat ? catLabelOpacity : expansion;

  // screenAngle tells us which visual half this label is on RIGHT NOW
  const screenAngle = ((item.baseAngle + rotation) % 360 + 360) % 360;
  const onLeftHalf = screenAngle > 180;

  // Place label further out along the same spoke
  const LABEL_R = isCat ? r + 22 : r + 14;
  const labelPos = polarXY(item.baseAngle, LABEL_R);

  // Rotate text so it reads radially outward.
  // baseAngle is in our polar system (0=top, clockwise).
  // SVG rotate() is clockwise from the right, so we convert:
  // svgAngle = baseAngle - 90
  // For left half, add 180 so text doesn't appear upside-down.
  const svgTextAngle = onLeftHalf
    ? item.baseAngle - 90 + 180
    : item.baseAngle - 90;
  const anchor = onLeftHalf ? "end" : "start";

  return (
    <g style={{ opacity: isCat ? 1 : expansion, transition: "opacity 0.35s ease" }}>
      <circle cx={pos.x} cy={pos.y} r={dotSize} fill={color}
        opacity={isSelected ? 1 : isCat ? 0.85 : 0.7}
        style={{ transition: "r 0.2s" }} />
      {isSelected && (
        <circle cx={pos.x} cy={pos.y} r={dotSize + 5}
          fill="none" stroke={color} strokeWidth={1.5} opacity={0.45} />
      )}
      <text
        x={labelPos.x} y={labelPos.y}
        textAnchor={anchor}
        dominantBaseline="central"
        fontSize={isCat ? 11.5 : 9.5}
        fontWeight={isSelected ? 600 : isCat ? 500 : 400}
        fill={isSelected ? color : isCat ? color : "#888888"}
        style={{ opacity: labelOpacity, transition: "opacity 0.35s ease", userSelect: "none" }}
        transform={`rotate(${svgTextAngle}, ${labelPos.x}, ${labelPos.y})`}
      >
        {item.label}
      </text>
    </g>
  );
}

export default function ImpressionWheel2() {
  const [rotation, setRotation] = useState(0);
  const [expansion, setExpansion] = useState(0);
  const [speedRange, setSpeedRange] = useState(0);
  const [selectedId, setSelectedId] = useState(() => findSelected(0, false));

  const drag = useRef({ active: false, startX: 0, startRot: 0, lastX: 0, lastVx: 0, lastTime: 0 });
  const slowTimer = useRef(null);
  const inertiaFrame = useRef(null);
  const refs = useRef({ expansion: 0, speedRange: 0, rotation: 0 });

  const applySpeed = useCallback((absVx, currentRot) => {
    const FAST = 200, SLOW = 25;
    if (absVx > FAST) {
      clearTimeout(slowTimer.current); slowTimer.current = null;
      refs.current.expansion = 0; refs.current.speedRange = 0;
      setExpansion(0); setSpeedRange(0);
      setSelectedId(findSelected(currentRot, false));
    } else if (absVx < SLOW) {
      if (!slowTimer.current) {
        slowTimer.current = setTimeout(() => {
          refs.current.expansion = 1; refs.current.speedRange = 2;
          setExpansion(1); setSpeedRange(2);
          setSelectedId(findSelected(refs.current.rotation, true));
        }, 350);
      }
      const ex = Math.max(refs.current.expansion, (1 - absVx / SLOW) * 0.6);
      refs.current.expansion = ex;
      const newSr = ex > 0.5 ? 2 : 1;
      refs.current.speedRange = newSr;
      setExpansion(ex); setSpeedRange(newSr);
      setSelectedId(findSelected(currentRot, newSr === 2));
    } else {
      clearTimeout(slowTimer.current); slowTimer.current = null;
      const t = (FAST - absVx) / (FAST - SLOW);
      const ex = t * t * 0.5;
      refs.current.expansion = ex; refs.current.speedRange = 1;
      setExpansion(ex); setSpeedRange(1);
      setSelectedId(findSelected(currentRot, false));
    }
  }, []);

  const onDown = useCallback((e) => {
    e.preventDefault();
    cancelAnimationFrame(inertiaFrame.current);
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    drag.current = { active: true, startX: x, startRot: refs.current.rotation, lastX: x, lastVx: 0, lastTime: Date.now() };
  }, []);

  const onMove = useCallback((e) => {
    if (!drag.current.active) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const now = Date.now();
    const dt = Math.max(1, now - drag.current.lastTime);
    drag.current.lastVx = (x - drag.current.lastX) / dt * 16;
    drag.current.lastX = x; drag.current.lastTime = now;
    const newRot = drag.current.startRot + ((x - drag.current.startX) / 380) * 360;
    refs.current.rotation = newRot;
    setRotation(newRot);
    applySpeed(Math.abs(drag.current.lastVx * 60), newRot);
  }, [applySpeed]);

  const onUp = useCallback(() => {
    if (!drag.current.active) return;
    drag.current.active = false;
    let m = drag.current.lastVx;
    const tick = () => {
      if (Math.abs(m) < 0.15) { applySpeed(0, refs.current.rotation); return; }
      refs.current.rotation += m; m *= 0.93;
      setRotation(refs.current.rotation);
      applySpeed(Math.abs(m * 60), refs.current.rotation);
      inertiaFrame.current = requestAnimationFrame(tick);
    };
    inertiaFrame.current = requestAnimationFrame(tick);
  }, [applySpeed]);

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [onMove, onUp]);

  const selected = selectedId ? ITEMS.find(i => i.id === selectedId) : null;
  const modeLabel = speedRange === 0 ? "fast" : speedRange === 2 ? "slow" : "browsing";
  const modeBg   = speedRange === 0 ? "#E6F1FB" : speedRange === 2 ? "#EAF3DE" : "#FAEEDA";
  const modeClr  = speedRange === 0 ? "#185FA5" : speedRange === 2 ? "#3B6D11" : "#854F0B";

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"24px 16px 20px", userSelect:"none", WebkitUserSelect:"none", gap:16, zIndex: 5, position: "relative" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, height:40 }}>
        <div style={{
          fontSize:15, fontWeight:500, padding:"6px 18px",
          border:"0.5px solid var(--color-border-secondary)",
          borderRadius:20, background:"var(--color-background-primary)",
          color: selected ? CAT_COLORS[selected.catIdx] : "var(--color-text-tertiary)",
          minWidth:150, textAlign:"center", transition:"color 0.2s",
        }}>
          {selected ? selected.label : "spin to explore"}
        </div>
        <div style={{ fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:20, background:modeBg, color:modeClr, border:`0.5px solid ${modeClr}44`, transition:"all 0.3s" }}>
          {modeLabel}
        </div>
      </div>

      <svg width={400} height={400} viewBox="0 0 400 400"
        style={{ cursor:"grab", touchAction:"none", maxWidth:"100%", display:"block" }}
        onMouseDown={onDown} onTouchStart={onDown}>
        <circle cx={CX} cy={CY} r={192} fill="none" stroke="var(--color-border-tertiary)" strokeWidth={0.5} />
        <circle cx={CX} cy={CY} r={148} fill="none" stroke="var(--color-border-tertiary)" strokeWidth={0.5} />
        <circle cx={CX} cy={CY} r={97}  fill="none" stroke="var(--color-border-tertiary)" strokeWidth={0.5} />
        <circle cx={CX} cy={CY} r={28}  fill="var(--color-background-secondary)" stroke="var(--color-border-secondary)" strokeWidth={0.5} />
        <circle cx={CX} cy={CY} r={4}   fill="var(--color-text-tertiary)" opacity={0.5} />
        <line x1={CX} y1={6} x2={CX} y2={28} stroke="var(--color-text-primary)" strokeWidth={1.5} strokeLinecap="round" opacity={0.35} />
        <polygon points={`${CX},1 ${CX-4},13 ${CX+4},13`} fill="var(--color-text-primary)" opacity={0.3} />

        <g style={{ transform:`rotate(${rotation}deg)`, transformOrigin:`${CX}px ${CY}px` }}>
          {ITEMS.map(item => (
            <WheelItem key={item.id} item={item} rotation={rotation} expansion={expansion} isSelected={item.id === selectedId} />
          ))}
        </g>
      </svg>

      <div style={{ fontSize:12, color:"var(--color-text-tertiary)", textAlign:"center" }}>
        drag left or right — slow for sub-items, fast for categories
      </div>
    </div>
  );
}