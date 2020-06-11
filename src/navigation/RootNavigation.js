import * as React from 'react';

export const navigationRef = React.createRef();

// Allows navigate to be called from anywhere
export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}
