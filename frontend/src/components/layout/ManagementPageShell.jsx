import ProfileMenu from "./ProfileMenu";

const DEFAULT_ACCENTS = ["#1E5FFF", "#FF7A1A", "#059669", "#8B5CF6"];

const ManagementPageShell = ({
  eyebrow,
  title,
  description,
  icon,
  breadcrumbs,
  action,
  stats = [],
  toolbar,
  children,
}) => {
  return (
    <div className="page-shell">
      <div className="page-shell__inner">
        <header
          className="page-hero animate-fade-in-down"
          style={{ overflow: "visible", zIndex: 20 }}
        >
          {breadcrumbs ? (
            <div className="page-hero__breadcrumbs">{breadcrumbs}</div>
          ) : null}

          <div className="page-hero__grid">
            <div className="page-hero__copy">
              {eyebrow ? <p className="page-hero__eyebrow">{eyebrow}</p> : null}
              <div className="page-hero__title-row">
                <h1 className="page-hero__title">{title}</h1>
                {icon ? <span className="page-hero__icon">{icon}</span> : null}
              </div>
              {description ? (
                <p className="page-hero__description">{description}</p>
              ) : null}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {action ? <div className="page-hero__action">{action}</div> : null}
              <ProfileMenu />
            </div>
          </div>

          {stats.length > 0 ? (
            <div className="page-metric-grid">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="page-metric"
                  style={{
                    "--metric-accent":
                      stat.accent || DEFAULT_ACCENTS[index % DEFAULT_ACCENTS.length],
                  }}
                >
                  <span className="page-metric__label">{stat.label}</span>
                  <div className="page-metric__value-row">
                    <span className="page-metric__value">{stat.value}</span>
                    {stat.hint ? (
                      <span className="page-metric__hint">{stat.hint}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </header>

        {toolbar ? (
          <section className="toolbar-card animate-fade-in-up">{toolbar}</section>
        ) : null}

        <div className="page-content">{children}</div>
      </div>
    </div>
  );
};

export default ManagementPageShell;
