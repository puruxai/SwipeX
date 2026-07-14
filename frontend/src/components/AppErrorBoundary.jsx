import React from 'react';
import { ApplicationErrorPage } from '../pages/ErrorPage';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) return <ApplicationErrorPage onRetry={this.handleRetry} />;
    return this.props.children;
  }
}
