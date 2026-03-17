import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <div className="mb-6 text-6xl">⚠️</div>
          <h1 className="mb-2 text-2xl font-bold text-[#071A34]">
            Что-то пошло не так
          </h1>
          <p className="mb-6 max-w-md text-[#6D7685]">
            Произошла непредвиденная ошибка. Попробуйте обновить страницу или
            вернуться назад.
          </p>
          <button
            onClick={this.handleRetry}
            className="rounded-xl bg-[#1F98FA] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1780d4]"
          >
            Попробовать снова
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
