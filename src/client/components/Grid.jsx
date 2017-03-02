import React from 'react';

const Row = ({ extraClass, children, middle, center, right }) => {
  let c = 'row';

  if (middle) c += ' align-middle';
  if (center) c += ' align-center';
  if (right) c += ' align-right';

  if (extraClass) {
    c += ` ${extraClass}`;
  }
  return (
    <div className={c} >
      {children}
    </div>
  );
};

const Column = ({ extraClass, children, small }) => {
  let c = 'column';
  if (extraClass) {
    c += ` ${extraClass}`;
  }
  if (small) c += ` small-${small}`;
  return (
    <div className={c}>
      {children}
    </div>
  );
};

Row.defaultProps = {
  extraClass: '',
  align: '',
  middle: false,
  center: false,
  right: false,
};

Row.propTypes = {
  extraClass: React.PropTypes.string,
  children: React.PropTypes.node.isRequired,
  middle: React.PropTypes.bool,
  center: React.PropTypes.bool,
  right: React.PropTypes.bool,
};

Column.defaultProps = {
  extraClass: '',
  small: null,
};

Column.propTypes = {
  small: React.PropTypes.number,
  extraClass: React.PropTypes.string,
  children: React.PropTypes.node.isRequired,
};

export {
  Row,
  Column,
};
