const DetailSectionCard = ({
  title,
  description,
  icon,
  action,
  children,
  className = "",
  bodyClassName = "",
}) => {
  const hasHeader = title || description || icon || action;

  return (
    <section className={`detail-panel ${className}`.trim()}>
      {hasHeader ? (
        <div className="detail-panel__header">
          <div className="detail-panel__heading">
            {icon ? <div className="detail-panel__icon">{icon}</div> : null}
            <div className="min-w-0">
              {title ? <h2 className="detail-panel__title">{title}</h2> : null}
              {description ? (
                <p className="detail-panel__description">{description}</p>
              ) : null}
            </div>
          </div>

          {action ? <div className="detail-panel__action">{action}</div> : null}
        </div>
      ) : null}

      <div
        className={`detail-panel__body ${bodyClassName}`.trim()}
      >
        {children}
      </div>
    </section>
  );
};

export default DetailSectionCard;
