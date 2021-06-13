import React from 'react';

const AspectRatio = ({ children, ratio = 1 }) => (
  <div style={{ width: '100%', position: 'relative', paddingTop: `${ratio * 100}%` }}>
    <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0}}>
      {children}
    </div>
  </div>
);

export default AspectRatio;
