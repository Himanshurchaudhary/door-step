import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// ─── Icons ───────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
    </svg>
);

const Icons = {
    dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    bookings: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
    vendors: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    users: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    services: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
    categories: "M4 6h16M4 10h16M4 14h16M4 18h16",
    attendance: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 11l-4 4-2-2",
    reports: "M18 20V10 M12 20V4 M6 20v-6",
    settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
    menu: "M3 12h18M3 6h18M3 18h18",
    close: "M18 6 6 18M6 6l12 12",
    chevron: "M9 18l6-6-6-6",
    bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
};

// ─── Nav Config ──────────────────────────────────────────────────────────────
const NAV = [
    {
        group: "Main",
        items: [
            { label: "Dashboard", icon: "dashboard", path: "/admin/dashboard" },
            { label: "Bookings", icon: "bookings", path: "/admin/admin-booking", badge: 4 },
            { label: "Partners", icon: "vendors", path: "/admin/partners" },
            { label: "Users", icon: "users", path: "/admin/users" },
        ]   //service-city
    },
    {
        group: "Catalogue",
        items: [
            { label: "Packages", icon: "services", path: "/admin/packages" },
            { label: "Addons", icon: "categories", path: "/admin/addons" },
            { label: "Service-city", icon: "categories", path: "/admin/service-city" },
            { label: "Car-Type", icon: "categories", path: "/admin/car-type" },


        ]
    },
    // {
    //     group: "Reports",
    //     items: [
    //         { label: "Attendance", icon: "attendance", path: "/admin/attendance" },
    //         { label: "Analytics", icon: "reports", path: "/admin/analytics" },
    //     ]
    // },
    {
        group: "System",
        items: [
            // { label: "Settings", icon: "settings", path: "/admin/settings" },
            { label: "Banner Management", icon: "settings", path: "/admin/banners" },

        ]
    },
];

// ─── Logo ────────────────────────────────────────────────────────────────────
const Logo = ({ collapsed }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
        <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg,#ec4899,#a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(236,72,153,0.35)"
        }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
            </svg>
        </div>
        {!collapsed && (
            <span style={{
                fontWeight: 800, fontSize: 17, letterSpacing: "-0.4px",
                color: "#1a1d3b", whiteSpace: "nowrap",
                fontFamily: "'Plus Jakarta Sans', sans-serif"
            }}>
                Door<span style={{ color: "#ec4899" }}>Step</span>
                <span style={{
                    marginLeft: 6, fontSize: 10, fontWeight: 600,
                    background: "linear-gradient(135deg,#ec4899,#a855f7)",
                    color: "#fff", borderRadius: 4, padding: "2px 6px",
                    verticalAlign: "middle", letterSpacing: 0.5
                }}>ADMIN</span>
            </span>
        )}
    </div>
);

// ─── NavItem ─────────────────────────────────────────────────────────────────
const NavItem = ({ item, collapsed, active, onClick }) => {
    const isActive = active === item.path;

    return (
        <button
            onClick={() => onClick(item.path)}
            title={collapsed ? item.label : ""}
            style={{
                display: "flex", alignItems: "center",
                gap: collapsed ? 0 : 11,
                justifyContent: collapsed ? "center" : "flex-start",
                width: "100%", padding: collapsed ? "11px" : "10px 12px",
                borderRadius: 10, border: "none", cursor: "pointer",
                background: isActive
                    ? "linear-gradient(135deg,rgba(236,72,153,0.12),rgba(168,85,247,0.08))"
                    : "transparent",
                color: isActive ? "#ec4899" : "#64748b",
                fontWeight: isActive ? 600 : 500,
                fontSize: 14,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: "all 0.18s ease",
                position: "relative",
                textAlign: "left",
                whiteSpace: "nowrap",
                outline: "none",
            }}
            onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = "#f8fafc";
                if (!isActive) e.currentTarget.style.color = "#1a1d3b";
            }}
            onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = "transparent";
                if (!isActive) e.currentTarget.style.color = "#64748b";
            }}
        >
            {/* Active bar */}
            {isActive && (
                <span style={{
                    position: "absolute", left: 0, top: "20%", bottom: "20%",
                    width: 3, borderRadius: 2,
                    background: "linear-gradient(180deg,#ec4899,#a855f7)"
                }} />
            )}

            {/* Icon */}
            <span style={{ flexShrink: 0, display: "flex" }}>
                <Icon d={Icons[item.icon]} size={18} />
            </span>

            {/* Label */}
            {!collapsed && (
                <span style={{ flex: 1 }}>{item.label}</span>
            )}

            {/* Badge */}
            {!collapsed && item.badge && (
                <span style={{
                    background: "#ec4899", color: "#fff",
                    fontSize: 11, fontWeight: 700,
                    borderRadius: 20, padding: "1px 7px", lineHeight: "18px"
                }}>{item.badge}</span>
            )}

            {/* Badge dot when collapsed */}
            {collapsed && item.badge && (
                <span style={{
                    position: "absolute", top: 6, right: 6,
                    width: 7, height: 7, borderRadius: "50%",
                    background: "#ec4899",
                    border: "1.5px solid #fff"
                }} />
            )}
        </button>
    );
};

// ─── Main Sidebar ─────────────────────────────────────────────────────────────
export default function AdminSidebar({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const overlayRef = useRef(null);

    const user = (() => {
        try { return JSON.parse(localStorage.getItem("al_user")) || {}; }
        catch { return {}; }
    })();

    // Close mobile sidebar on route change
    useEffect(() => { setMobileOpen(false); }, [location.pathname]);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (mobileOpen && overlayRef.current === e.target) setMobileOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [mobileOpen]);

    const handleNav = (path) => {
        navigate(path);
        setMobileOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem("al_token");
        localStorage.removeItem("al_user");
        navigate("/admin/login");
    };

    // ── Sidebar content ────────────────────────────────────────────────────────
    const SidebarContent = ({ isMobile = false }) => (
        <div style={{
            display: "flex", flexDirection: "column",
            height: "100%", overflow: "hidden",
        }}>
            {/* Header */}
            <div style={{
                padding: collapsed && !isMobile ? "20px 12px" : "20px 18px",
                display: "flex", alignItems: "center",
                justifyContent: collapsed && !isMobile ? "center" : "space-between",
                borderBottom: "1px solid #f1f5f9",
                flexShrink: 0,
            }}>
                <Logo collapsed={collapsed && !isMobile} />
                {isMobile ? (
                    <button onClick={() => setMobileOpen(false)} style={iconBtnStyle}>
                        <Icon d={Icons.close} size={18} />
                    </button>
                ) : (
                    <button onClick={() => setCollapsed(v => !v)} style={iconBtnStyle}
                        title={collapsed ? "Expand" : "Collapse"}>
                        <Icon d={Icons.chevron} size={16} />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px", scrollbarWidth: "none" }}>
                {NAV.map((group) => (
                    <div key={group.group} style={{ marginBottom: 4 }}>
                        {/* Group label */}
                        {(!collapsed || isMobile) && (
                            <p style={{
                                fontSize: 10.5, fontWeight: 700, letterSpacing: 1,
                                color: "#94a3b8", textTransform: "uppercase",
                                padding: "8px 12px 4px", margin: 0,
                                fontFamily: "'Plus Jakarta Sans', sans-serif"
                            }}>{group.group}</p>
                        )}
                        {collapsed && !isMobile && (
                            <div style={{ borderTop: "1px solid #f1f5f9", margin: "6px 4px" }} />
                        )}
                        {group.items.map(item => (
                            <NavItem
                                key={item.path}
                                item={item}
                                collapsed={collapsed && !isMobile}
                                active={location.pathname}
                                onClick={handleNav}
                            />
                        ))}
                    </div>
                ))}
            </nav>

            {/* User + Logout */}
            <div style={{
                borderTop: "1px solid #f1f5f9",
                padding: collapsed && !isMobile ? "14px 10px" : "14px 12px",
                flexShrink: 0,
            }}>
                {/* User card */}
                {(!collapsed || isMobile) && (
                    <div style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 10px", borderRadius: 10,
                        background: "#f8fafc", marginBottom: 8,
                    }}>
                        <div style={{
                            width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                            background: "linear-gradient(135deg,#ec4899,#a855f7)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", fontWeight: 700, fontSize: 14,
                            fontFamily: "'Plus Jakarta Sans', sans-serif"
                        }}>
                            {(user.name || "A").charAt(0).toUpperCase()}
                        </div>
                        <div style={{ overflow: "hidden" }}>
                            <p style={{
                                margin: 0, fontSize: 13, fontWeight: 600,
                                color: "#1a1d3b", whiteSpace: "nowrap",
                                overflow: "hidden", textOverflow: "ellipsis",
                                fontFamily: "'Plus Jakarta Sans', sans-serif"
                            }}>{user.name || "Admin"}</p>
                            <p style={{
                                margin: 0, fontSize: 11, color: "#94a3b8",
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                fontFamily: "'Plus Jakarta Sans', sans-serif"
                            }}>{user.email || ""}</p>
                        </div>
                    </div>
                )}

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    title={collapsed && !isMobile ? "Logout" : ""}
                    style={{
                        display: "flex", alignItems: "center",
                        gap: collapsed && !isMobile ? 0 : 10,
                        justifyContent: collapsed && !isMobile ? "center" : "flex-start",
                        width: "100%", padding: collapsed && !isMobile ? "11px" : "10px 12px",
                        borderRadius: 10, border: "none", cursor: "pointer",
                        background: "transparent",
                        color: "#ef4444", fontSize: 14, fontWeight: 500,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                    <Icon d={Icons.logout} size={17} />
                    {(!collapsed || isMobile) && <span>Logout</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f5f6fa; }
        ::-webkit-scrollbar { width: 0; }

        .admin-layout {
          display: flex;
          min-height: 100vh;
        }

        /* ── Desktop Sidebar ── */
        .admin-sidebar-desktop {
          position: fixed; top: 0; left: 0; bottom: 0;
          background: #fff;
          border-right: 1px solid #f1f5f9;
          box-shadow: 2px 0 12px rgba(0,0,0,0.04);
          transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
          z-index: 100;
          display: flex; flex-direction: column;
        }

        /* ── Mobile Overlay ── */
        .mobile-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 200;
          backdrop-filter: blur(2px);
        }
        .mobile-sidebar {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: 270px;
          background: #fff;
          box-shadow: 4px 0 24px rgba(0,0,0,0.12);
          z-index: 201;
          transform: translateX(-100%);
          transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
          display: flex; flex-direction: column;
        }

        /* ── Topbar (mobile) ── */
        .admin-topbar {
          display: none;
          position: fixed; top: 0; left: 0; right: 0;
          height: 58px;
          background: #fff;
          border-bottom: 1px solid #f1f5f9;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          z-index: 150;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        /* ── Main content ── */
        .admin-main {
          transition: margin-left 0.25s cubic-bezier(0.4,0,0.2,1);
          min-height: 100vh;
          flex: 1;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-topbar { display: flex !important; }
          .admin-main { margin-left: 0 !important; padding-top: 58px; }
        }
        @media (min-width: 769px) {
          .mobile-overlay, .mobile-sidebar { display: none !important; }
        }
      `}</style>

            <div className="admin-layout">

                {/* ── Desktop Sidebar ── */}
                <aside
                    className="admin-sidebar-desktop"
                    style={{ width: collapsed ? 64 : 240 }}
                >
                    <SidebarContent />
                </aside>

                {/* ── Mobile Overlay ── */}
                <div
                    className="mobile-overlay"
                    ref={overlayRef}
                    style={{ display: mobileOpen ? "block" : "none" }}
                    onClick={() => setMobileOpen(false)}
                />

                {/* ── Mobile Sidebar ── */}
                <aside
                    className="mobile-sidebar"
                    style={{ transform: mobileOpen ? "translateX(0)" : "translateX(-100%)", display: "flex" }}
                >
                    <SidebarContent isMobile />
                </aside>

                {/* ── Mobile Topbar ── */}
                <header className="admin-topbar">
                    <button onClick={() => setMobileOpen(true)} style={iconBtnStyle}>
                        <Icon d={Icons.menu} size={20} />
                    </button>
                    <Logo collapsed={false} />
                    <button style={iconBtnStyle}>
                        <Icon d={Icons.bell} size={20} />
                        <span style={{
                            position: "absolute", top: 6, right: 6,
                            width: 7, height: 7, borderRadius: "50%",
                            background: "#ec4899", border: "1.5px solid #fff"
                        }} />
                    </button>
                </header>

                {/* ── Main Content ── */}
                <main
                    className="admin-main"
                    style={{ marginLeft: collapsed ? 64 : 240 }}
                >
                    {children}
                </main>

            </div>
        </>
    );
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const iconBtnStyle = {
    width: 34, height: 34,
    borderRadius: 8, border: "none",
    background: "transparent",
    color: "#64748b",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", flexShrink: 0,
    position: "relative",
    transition: "background 0.15s, color 0.15s",
};