 /* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';

const Row = ({
  className,
  extraClass,
  children,
  middle,
  bottom,
  center,
  right,
  onClick,
  expanded,
}) => {
  let c = 'row';

  if (middle) c += ' align-middle';
  if (center) c += ' align-center';
  if (right) c += ' align-right';
  if (bottom) c += ' align-bottom';
  if (expanded) c += ' expanded';

  if (className) {
    c += ` ${className}`;
  }
  if (extraClass) {
    c += ` ${extraClass}`;
  }

  return (
    <div className={c} onClick={onClick} >
      {children}
    </div>
  );
};

const Column = ({ className, extraClass, children, small, onClick }) => {
  let c = 'column';
  if (extraClass) {
    c += ` ${extraClass}`;
  }
  if (className) {
    c += ` ${className}`;
  }
  if (small) c += ` small-${small}`;
  return (
    <div className={c} onClick={onClick} >
      {children}
    </div>
  );
};

Row.defaultProps = {
  align: '',
  bottom: false,
  center: false,
  className: '',
  children: null,
  expanded: false,
  extraClass: '',
  middle: false,
  onClick: null,
  right: false,
};

Row.propTypes = {
  bottom: React.PropTypes.bool,
  center: React.PropTypes.bool,
  children: React.PropTypes.node.isRequired,
  className: React.PropTypes.string,
  expanded: React.PropTypes.bool,
  extraClass: React.PropTypes.string,
  middle: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  right: React.PropTypes.bool,
};

Column.defaultProps = {
  extraClass: '',
  className: '',
  small: null,
  onClick: null,
};

Column.propTypes = {
  small: React.PropTypes.number,
  extraClass: React.PropTypes.string,
  className: React.PropTypes.string,
  children: React.PropTypes.node.isRequired,
  onClick: React.PropTypes.func,
};

export {
  Row,
  Column,
};
 /* eslint-enable jsx-a11y/no-static-element-interactions */
