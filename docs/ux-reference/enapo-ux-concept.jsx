import { useState } from "react";

const COLORS = {
  bg: "#F0EDE8",
  bgWarm: "#E8E4DE",
  glass: "rgba(255, 255, 255, 0.55)",
  glassBorder: "rgba(255, 255, 255, 0.7)",
  glassHover: "rgba(255, 255, 255, 0.7)",
  primary: "#1A9E8F",
  primaryLight: "#2CC4B3",
  primaryGlass: "rgba(26, 158, 143, 0.12)",
  accent: "#E8734A",
  accentLight: "#FF9470",
  text: "#1A1A1A",
  textSecondary: "#6B6B6B",
  textMuted: "#9B9B9B",
  decided: "#1A9E8F",
  open: "#E8A94A",
  empty: "#C4C0BA",
  shadow: "rgba(0, 0, 0, 0.06)",
  shadowMd: "rgba(0, 0, 0, 0.1)",
};

const GlassCard = ({ children, style = {}, hover = false, onClick, className = "" }) => (
  <div
    onClick={onClick}
    className={className}
    style={{
      background: COLORS.glass,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: `1px solid ${COLORS.glassBorder}`,
      borderRadius: 16,
      boxShadow: `0 4px 24px ${COLORS.shadow}, 0 1px 4px ${COLORS.shadow}`,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: onClick ? "pointer" : "default",
      ...style,
    }}
  >
    {children}
  </div>
);

const Pill = ({ children, active, onClick, color = COLORS.primary }) => (
  <button
    onClick={onClick}
    style={{
      padding: "6px 14px",
      borderRadius: 20,
      border: active ? "none" : `1px solid ${COLORS.glassBorder}`,
      background: active ? color : COLORS.glass,
      backdropFilter: "blur(12px)",
      color: active ? "#fff" : COLORS.textSecondary,
      fontSize: 13,
      fontWeight: 500,
      cursor: "pointer",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </button>
);

const ProgressDots = ({ decided, open, total }) => (
  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          background: i < decided ? COLORS.decided : i < decided + open ? COLORS.open : COLORS.empty,
          transition: "all 0.3s ease",
        }}
      />
    ))}
  </div>
);

const Avatar = ({ name, size = 28, color }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size,
      background: color || COLORS.primaryLight,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontSize: size * 0.4,
      fontWeight: 600,
      border: "2px solid rgba(255,255,255,0.8)",
      flexShrink: 0,
    }}
  >
    {name[0]}
  </div>
);

const AvatarStack = ({ names, colors }) => (
  <div style={{ display: "flex", marginLeft: 4 }}>
    {names.map((n, i) => (
      <div key={i} style={{ marginLeft: i > 0 ? -8 : 0, zIndex: names.length - i }}>
        <Avatar name={n} size={26} color={colors?.[i]} />
      </div>
    ))}
  </div>
);

// ─── SCREENS ────────────────────────────────────────

const TripListScreen = ({ onSelect }) => {
  const trips = [
    { name: "Lissabon Sommer 🇵🇹", members: ["Mia", "Tom", "Lea", "Jan"], colors: ["#1A9E8F", "#E8734A", "#7B6FDE", "#E8A94A"], decided: 2, open: 1, total: 4, date: "Jul 2026" },
    { name: "Barcelona Weekend 🇪🇸", members: ["Mia", "Nora", "Felix"], colors: ["#1A9E8F", "#DE6F8A", "#4A90D9"], decided: 0, open: 2, total: 3, date: "Mai 2026" },
    { name: "Roadtrip Kroatien 🇭🇷", members: ["Mia", "Tom", "Lea", "Jan", "Nora", "Felix"], colors: ["#1A9E8F", "#E8734A", "#7B6FDE", "#E8A94A", "#DE6F8A", "#4A90D9"], decided: 0, open: 0, total: 5, date: "Aug 2026" },
  ];

  return (
    <div style={{ padding: "0 16px 80px" }}>
      <div style={{ padding: "12px 0 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 14, color: COLORS.textMuted, fontWeight: 500 }}>Hallo Mia 👋</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text, marginTop: 2 }}>Deine Trips</div>
        </div>
        <div
          style={{
            width: 40, height: 40, borderRadius: 20,
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 20, cursor: "pointer",
            boxShadow: `0 4px 14px rgba(26, 158, 143, 0.35)`,
          }}
        >
          +
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {trips.map((trip, i) => (
          <GlassCard key={i} onClick={() => onSelect(trip)} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 17, fontWeight: 600, color: COLORS.text }}>{trip.name}</div>
                <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>{trip.date} · {trip.members.length} Personen</div>
              </div>
              <AvatarStack names={trip.members} colors={trip.colors} />
            </div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
              <ProgressDots decided={trip.decided} open={trip.open} total={trip.total} />
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>
                {trip.decided}/{trip.total} entschieden
              </span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

const TripDashboard = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("options");
  const [filter, setFilter] = useState("all");
  const [votes, setVotes] = useState({ 0: null, 1: null, 2: null });

  const options = [
    { title: "Airbnb Alfama – Altstadt-Loft", domain: "airbnb.com", price: "89€/Nacht", rating: "4.8", cat: "accommodation", img: "🏠", status: "active", votes: { yes: 3, no: 0 } },
    { title: "Hostel Lisboa Central", domain: "hostelworld.com", price: "24€/Nacht", cat: "accommodation", img: "🏨", status: "active", votes: { yes: 1, no: 1 } },
    { title: "Time Out Market Food Tour", domain: "getyourguide.com", price: "35€/Person", rating: "4.9", cat: "activity", img: "🍽️", status: "decided", votes: { yes: 4, no: 0 } },
    { title: "Sintra Tagestrip", domain: "getyourguide.com", price: "42€/Person", rating: "4.7", cat: "activity", img: "🏰", status: "active", votes: { yes: 2, no: 1 } },
    { title: "TAP Air – FRA→LIS", domain: "skyscanner.de", price: "127€ Hin+Rück", cat: "flight", img: "✈️", status: "decided", votes: { yes: 4, no: 0 } },
  ];

  const filters = [
    { id: "all", label: "Alle" },
    { id: "accommodation", label: "🏠 Unterkunft" },
    { id: "flight", label: "✈️ Flug" },
    { id: "activity", label: "🎯 Aktivität" },
  ];

  const filtered = filter === "all" ? options : options.filter((o) => o.cat === filter);

  const handleVote = (idx, vote) => {
    setVotes((prev) => ({ ...prev, [idx]: prev[idx] === vote ? null : vote }));
  };

  return (
    <div style={{ padding: "0 16px 90px" }}>
      {/* Header */}
      <div style={{ padding: "12px 0 6px", display: "flex", alignItems: "center", gap: 10 }}>
        <div onClick={onBack} style={{ fontSize: 22, cursor: "pointer", color: COLORS.primary }}>‹</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>Lissabon Sommer 🇵🇹</div>
          <div style={{ fontSize: 13, color: COLORS.textMuted }}>Jul 2026 · 4 Personen</div>
        </div>
      </div>

      {/* Decision Board Mini */}
      <GlassCard style={{ padding: 14, marginTop: 12, background: COLORS.primaryGlass }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.primary, marginBottom: 8 }}>Decision Board</div>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { label: "Flug", status: "decided", icon: "✈️" },
            { label: "Unterkunft", status: "voting", icon: "🏠" },
            { label: "Food Tour", status: "decided", icon: "🍽️" },
            { label: "Ausflüge", status: "open", icon: "🏰" },
          ].map((d, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "8px 4px",
                borderRadius: 10,
                background: d.status === "decided" ? "rgba(26, 158, 143, 0.15)" : d.status === "voting" ? "rgba(232, 169, 74, 0.15)" : "rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ fontSize: 18 }}>{d.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: COLORS.text, marginTop: 2 }}>{d.label}</div>
              <div
                style={{
                  fontSize: 10,
                  color: d.status === "decided" ? COLORS.decided : d.status === "voting" ? COLORS.open : COLORS.textMuted,
                  fontWeight: 600,
                  marginTop: 2,
                }}
              >
                {d.status === "decided" ? "✓" : d.status === "voting" ? "⟳ Vote" : "—"}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginTop: 18, borderBottom: `1px solid rgba(0,0,0,0.06)` }}>
        {["options", "votes", "chat"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: "10px 0", border: "none", background: "none", cursor: "pointer",
              fontSize: 14, fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? COLORS.primary : COLORS.textMuted,
              borderBottom: activeTab === tab ? `2px solid ${COLORS.primary}` : "2px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            {tab === "options" ? `Optionen (${options.length})` : tab === "votes" ? "Abstimmung" : "Chat"}
          </button>
        ))}
      </div>

      {activeTab === "options" && (
        <>
          {/* Filters */}
          <div style={{ display: "flex", gap: 6, marginTop: 14, overflowX: "auto", paddingBottom: 4 }}>
            {filters.map((f) => (
              <Pill key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</Pill>
            ))}
          </div>

          {/* Option Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            {filtered.map((opt, i) => (
              <GlassCard
                key={i}
                style={{
                  padding: 0, overflow: "hidden",
                  border: opt.status === "decided" ? `1.5px solid ${COLORS.decided}` : `1px solid ${COLORS.glassBorder}`,
                }}
              >
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      width: 64, minHeight: 80,
                      background: opt.status === "decided" ? "rgba(26, 158, 143, 0.1)" : "rgba(0,0,0,0.03)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 28, flexShrink: 0,
                    }}
                  >
                    {opt.img}
                  </div>
                  <div style={{ padding: "10px 12px", flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, lineHeight: 1.3 }}>{opt.title}</div>
                      {opt.status === "decided" && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.decided, background: "rgba(26,158,143,0.12)", padding: "2px 8px", borderRadius: 8, whiteSpace: "nowrap", marginLeft: 6 }}>
                          ✓ DECIDED
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>{opt.domain}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.primary }}>{opt.price}</span>
                      {opt.rating && <span style={{ fontSize: 12, color: COLORS.textSecondary }}>★ {opt.rating}</span>}
                    </div>
                    {opt.status === "active" && (
                      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                        <button
                          onClick={() => handleVote(i, "yes")}
                          style={{
                            padding: "4px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
                            background: votes[i] === "yes" ? COLORS.primary : "rgba(26,158,143,0.1)",
                            color: votes[i] === "yes" ? "#fff" : COLORS.primary,
                            transition: "all 0.2s ease",
                          }}
                        >
                          👍 {opt.votes.yes + (votes[i] === "yes" ? 1 : 0)}
                        </button>
                        <button
                          onClick={() => handleVote(i, "no")}
                          style={{
                            padding: "4px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
                            background: votes[i] === "no" ? "#E85C4A" : "rgba(232,92,74,0.1)",
                            color: votes[i] === "no" ? "#fff" : "#E85C4A",
                            transition: "all 0.2s ease",
                          }}
                        >
                          👎 {opt.votes.no + (votes[i] === "no" ? 1 : 0)}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Add Link FAB */}
          <div style={{ position: "fixed", bottom: 80, right: 24, zIndex: 50 }}>
            <div
              style={{
                width: 52, height: 52, borderRadius: 16,
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accentLight})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 6px 20px rgba(232, 115, 74, 0.4)`,
                cursor: "pointer", fontSize: 14, color: "#fff", fontWeight: 600,
              }}
            >
              🔗+
            </div>
          </div>
        </>
      )}

      {activeTab === "votes" && (
        <div style={{ marginTop: 16 }}>
          <GlassCard style={{ padding: 16, border: `1.5px solid ${COLORS.open}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text }}>🏠 Unterkunft wählen</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>3 von 4 haben abgestimmt</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.open, background: "rgba(232,169,74,0.15)", padding: "3px 10px", borderRadius: 8 }}>
                ⏳ 18h übrig
              </span>
            </div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { name: "Airbnb Alfama – Altstadt-Loft", pct: 75, votes: 3 },
                { name: "Hostel Lisboa Central", pct: 25, votes: 1 },
              ].map((v, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                    <span style={{ fontWeight: 500, color: COLORS.text }}>{v.name}</span>
                    <span style={{ color: COLORS.textMuted }}>{v.votes} Stimmen</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: "rgba(0,0,0,0.06)" }}>
                    <div
                      style={{
                        height: 6, borderRadius: 3, width: `${v.pct}%`,
                        background: i === 0 ? `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryLight})` : COLORS.empty,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, display: "flex", gap: 4 }}>
              <AvatarStack names={["Tom", "Lea", "Jan"]} colors={["#E8734A", "#7B6FDE", "#E8A94A"]} />
              <span style={{ fontSize: 12, color: COLORS.textMuted, alignSelf: "center", marginLeft: 6 }}>haben abgestimmt · Mia fehlt noch</span>
            </div>
          </GlassCard>

          <GlassCard style={{ padding: 16, marginTop: 10, opacity: 0.7 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text }}>✈️ Flug</div>
                <div style={{ fontSize: 12, color: COLORS.decided, fontWeight: 600, marginTop: 2 }}>✓ Entschieden: TAP Air FRA→LIS</div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {activeTab === "chat" && (
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            { name: "Tom", color: "#E8734A", msg: "Das Airbnb in Alfama sieht mega aus! Direkt in der Altstadt 🏘️", time: "14:32" },
            { name: "Lea", color: "#7B6FDE", msg: "Ja, aber 89€/Nacht pro Person oder insgesamt?", time: "14:35" },
            { name: "Jan", color: "#E8A94A", msg: "Insgesamt für 4 – also ~22€ pp. Das ist gut!", time: "14:38" },
            { name: "Mia", color: "#1A9E8F", msg: "Hab noch ein Hostel in der Innenstadt gefunden, check die Option 👆", time: "15:02" },
          ].map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <Avatar name={m.name} size={28} color={m.color} />
              <GlassCard style={{ padding: "8px 12px", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: m.color }}>{m.name}</span>
                  <span style={{ fontSize: 11, color: COLORS.textMuted }}>{m.time}</span>
                </div>
                <div style={{ fontSize: 14, color: COLORS.text, marginTop: 3, lineHeight: 1.4 }}>{m.msg}</div>
              </GlassCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── LINK PASTE DEMO ────────────────────────────────

const LinkPasteDemo = () => {
  const [stage, setStage] = useState(0);

  const reset = () => setStage(0);

  return (
    <div style={{ padding: "0 16px 20px" }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>
        ✨ Der Wow-Moment: Link → Karte
      </div>

      <GlassCard style={{ padding: 14 }}>
        {stage === 0 && (
          <div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 8 }}>Link einfügen</div>
            <div
              onClick={() => setStage(1)}
              style={{
                padding: "10px 14px", borderRadius: 10, border: `1px dashed ${COLORS.empty}`,
                color: COLORS.textMuted, fontSize: 14, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <span>🔗</span>
              <span>booking.com/hotel/pt/alfama-loft...</span>
            </div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 8, textAlign: "center" }}>
              Tap zum Simulieren →
            </div>
          </div>
        )}

        {stage === 1 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div className="spinner" style={{
                width: 16, height: 16, border: `2px solid ${COLORS.primaryGlass}`,
                borderTopColor: COLORS.primary, borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
              <span style={{ fontSize: 13, color: COLORS.primary, fontWeight: 500 }}>Analysiere Link...</span>
            </div>
            {setTimeout(() => setStage(2), 1200) && null}
          </div>
        )}

        {stage === 2 && (
          <div style={{ animation: "fadeUp 0.4s ease" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{
                width: 72, height: 72, borderRadius: 10, background: "linear-gradient(135deg, #f0d9c4, #e8c4a0)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0,
              }}>
                🏠
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>booking.com</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, marginTop: 2 }}>Alfama Loft – Altstadt Lissabon</div>
                <div style={{ display: "flex", gap: 10, marginTop: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.primary }}>89€</span>
                  <span style={{ fontSize: 12, color: COLORS.textSecondary }}>/ Nacht</span>
                  <span style={{ fontSize: 12, color: COLORS.textSecondary }}>★ 4.8</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
              <Pill active color={COLORS.primary}>🏠 Unterkunft</Pill>
              <Pill>❤️ Favorit</Pill>
            </div>
            <button
              onClick={reset}
              style={{
                marginTop: 10, width: "100%", padding: "8px 0", borderRadius: 10, border: "none",
                background: "rgba(0,0,0,0.04)", color: COLORS.textMuted, fontSize: 12, cursor: "pointer",
              }}
            >
              Nochmal abspielen ↺
            </button>
          </div>
        )}
      </GlassCard>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// ─── MAIN APP ───────────────────────────────────────

export default function ENAPODesignConcept() {
  const [screen, setScreen] = useState("overview");
  const [activePhone, setActivePhone] = useState("trips");

  const PhoneFrame = ({ children }) => (
    <div style={{
      width: 320, height: 640, borderRadius: 36, overflow: "hidden",
      background: COLORS.bg, position: "relative",
      boxShadow: `0 20px 60px rgba(0,0,0,0.15), 0 2px 10px rgba(0,0,0,0.08)`,
      border: "6px solid #1a1a1a", flexShrink: 0,
    }}>
      {/* Status Bar */}
      <div style={{
        height: 44, padding: "0 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "rgba(255,255,255,0.5)", backdropFilter: "blur(10px)",
        fontSize: 12, fontWeight: 600, color: COLORS.text,
      }}>
        <span>9:41</span>
        <div style={{ width: 80, height: 22, borderRadius: 11, background: "#1a1a1a" }} />
        <span>📶 🔋</span>
      </div>

      {/* Background decoration */}
      <div style={{
        position: "absolute", top: 60, right: -30, width: 200, height: 200,
        borderRadius: "50%", background: "rgba(26, 158, 143, 0.08)", filter: "blur(40px)",
      }} />
      <div style={{
        position: "absolute", bottom: 100, left: -40, width: 160, height: 160,
        borderRadius: "50%", background: "rgba(232, 115, 74, 0.06)", filter: "blur(40px)",
      }} />

      {/* Content */}
      <div style={{ height: "calc(100% - 44px - 56px)", overflowY: "auto", position: "relative", zIndex: 1 }}>
        {children}
      </div>

      {/* Bottom Nav */}
      <div style={{
        height: 56, display: "flex", justifyContent: "space-around", alignItems: "center",
        background: "rgba(255,255,255,0.7)", backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,0,0,0.05)", position: "absolute", bottom: 0, left: 0, right: 0,
      }}>
        {[
          { id: "trips", icon: "🗺️", label: "Trips" },
          { id: "options", icon: "🔗", label: "Optionen" },
          { id: "votes", icon: "🗳️", label: "Votes" },
          { id: "profile", icon: "👤", label: "Profil" },
        ].map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActivePhone(tab.id)}
            style={{
              textAlign: "center", cursor: "pointer",
              color: activePhone === tab.id ? COLORS.primary : COLORS.textMuted,
              transition: "color 0.2s ease",
            }}
          >
            <div style={{ fontSize: 20 }}>{tab.icon}</div>
            <div style={{ fontSize: 10, fontWeight: activePhone === tab.id ? 600 : 400, marginTop: 1 }}>{tab.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(145deg, #F5F2ED 0%, #E8E4DE 50%, #EDE8E0 100%)`,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
      color: COLORS.text,
    }}>
      {/* Header */}
      <div style={{ padding: "28px 32px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>
          <span style={{ color: COLORS.primary }}>ENAPO</span>
          <span style={{ color: COLORS.textMuted, fontWeight: 400, fontSize: 14, marginLeft: 8 }}>UX Design Concept</span>
        </div>
        <div style={{ fontSize: 14, color: COLORS.textSecondary, marginTop: 4 }}>
          Liquid Glass · Mobile-First · Decision-Oriented
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "0 16px", flexWrap: "wrap" }}>
        {[
          { id: "overview", label: "📱 Trip-Übersicht" },
          { id: "dashboard", label: "📋 Trip-Dashboard" },
          { id: "linkdemo", label: "✨ Link→Karte" },
          { id: "designsystem", label: "🎨 Design System" },
        ].map((tab) => (
          <Pill key={tab.id} active={screen === tab.id} onClick={() => setScreen(tab.id)} color={COLORS.primary}>
            {tab.label}
          </Pill>
        ))}
      </div>

      {/* Content */}
      <div style={{ display: "flex", justifyContent: "center", padding: "24px 16px 40px" }}>
        {screen === "overview" && (
          <PhoneFrame>
            <TripListScreen onSelect={() => setScreen("dashboard")} />
          </PhoneFrame>
        )}

        {screen === "dashboard" && (
          <PhoneFrame>
            <TripDashboard onBack={() => setScreen("overview")} />
          </PhoneFrame>
        )}

        {screen === "linkdemo" && (
          <PhoneFrame>
            <div style={{ padding: "12px 0 6px 16px" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.text }}>Lissabon Sommer 🇵🇹</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted }}>Option hinzufügen</div>
            </div>
            <LinkPasteDemo />
            <div style={{ padding: "0 16px" }}>
              <GlassCard style={{ padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 8 }}>💡 So funktioniert's</div>
                <div style={{ fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.6 }}>
                  1. Kopiere einen Link von Booking, Airbnb, Skyscanner etc.<br />
                  2. Füge ihn hier ein – ENAPO erkennt automatisch Titel, Bild und Preis<br />
                  3. Die Karte erscheint sofort für die ganze Gruppe<br />
                  4. Wenn etwas fehlt? Einfach manuell ergänzen.
                </div>
              </GlassCard>
            </div>
          </PhoneFrame>
        )}

        {screen === "designsystem" && (
          <div style={{ maxWidth: 640, width: "100%" }}>
            {/* Colors */}
            <GlassCard style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>🎨 Farben</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { name: "Primary (Teal)", color: COLORS.primary },
                  { name: "CTA (Coral)", color: COLORS.accent },
                  { name: "Decided", color: COLORS.decided },
                  { name: "Voting/Open", color: COLORS.open },
                  { name: "Background", color: COLORS.bg },
                  { name: "Text", color: COLORS.text },
                  { name: "Secondary", color: COLORS.textSecondary },
                  { name: "Muted", color: COLORS.textMuted },
                ].map((c, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12, background: c.color,
                      border: "2px solid rgba(255,255,255,0.6)",
                      boxShadow: `0 2px 8px ${COLORS.shadow}`,
                    }} />
                    <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 4, maxWidth: 56 }}>{c.name}</div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Glass Levels */}
            <GlassCard style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>🪟 Liquid Glass Ebenen</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Surface (Nav, Modals)", opacity: 0.7, blur: 20 },
                  { label: "Card (Standard)", opacity: 0.55, blur: 20 },
                  { label: "Elevated (Active Card)", opacity: 0.75, blur: 24 },
                  { label: "Accent Glass (Decision Board)", opacity: 0.12, blur: 16, tint: true },
                ].map((g, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "12px 16px", borderRadius: 12,
                      background: g.tint ? `rgba(26, 158, 143, ${g.opacity})` : `rgba(255, 255, 255, ${g.opacity})`,
                      backdropFilter: `blur(${g.blur}px)`,
                      border: "1px solid rgba(255,255,255,0.5)",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{g.label}</span>
                    <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "monospace" }}>
                      opacity: {g.opacity} · blur: {g.blur}px
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Components */}
            <GlassCard style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>🧩 Komponenten</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>Pills / Filter</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <Pill active>Aktiv</Pill>
                    <Pill>Inaktiv</Pill>
                    <Pill active color={COLORS.accent}>CTA</Pill>
                    <Pill>🏠 Unterkunft</Pill>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>Progress Dots</div>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <ProgressDots decided={2} open={1} total={5} />
                    <span style={{ fontSize: 12, color: COLORS.textMuted }}>2/5 entschieden</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>Avatar Stack</div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <AvatarStack names={["Mia", "Tom", "Lea", "Jan"]} colors={["#1A9E8F", "#E8734A", "#7B6FDE", "#E8A94A"]} />
                    <span style={{ fontSize: 12, color: COLORS.textMuted }}>4 Teilnehmer</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>Buttons</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button style={{
                      padding: "10px 20px", borderRadius: 12, border: "none", cursor: "pointer",
                      background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
                      color: "#fff", fontWeight: 600, fontSize: 14,
                      boxShadow: `0 4px 14px rgba(26, 158, 143, 0.35)`,
                    }}>
                      Trip erstellen
                    </button>
                    <button style={{
                      padding: "10px 20px", borderRadius: 12, cursor: "pointer",
                      background: COLORS.glass, backdropFilter: "blur(12px)",
                      border: `1px solid ${COLORS.glassBorder}`,
                      color: COLORS.text, fontWeight: 500, fontSize: 14,
                    }}>
                      Einladen
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Key Principles */}
            <GlassCard style={{ padding: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>📐 Design-Prinzipien</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { title: "Entscheidung > Information", desc: "Jeder Screen muss einer Entscheidung dienen. Kein Content ohne Aktion." },
                  { title: "Graceful Degradation", desc: "Fehlende Daten dürfen nie den Loop blockieren. Immer Fallback zeigen." },
                  { title: "90-Sekunden-Regel", desc: "Von App-Start bis erste Karte in < 90 Sekunden. Kein Onboarding-Wall." },
                  { title: "Glass = Tiefe, nicht Spielerei", desc: "Blur-Effekte schaffen Hierarchie. Navigation ist Glass, Content ist Card." },
                  { title: "4px Grid, 16px Padding", desc: "Konsistentes Spacing. Karten atmen. Nichts klebt zusammen." },
                ].map((p, i) => (
                  <div key={i} style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(0,0,0,0.025)" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{p.title}</div>
                    <div style={{ fontSize: 12, color: COLORS.textSecondary, marginTop: 2, lineHeight: 1.4 }}>{p.desc}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
