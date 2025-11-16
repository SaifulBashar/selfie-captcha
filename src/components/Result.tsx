import Button from './Button';

export const Result = (props: {
  validationResult: 'success' | 'failed' | null;
  handleRetry: () => void;
}) => {
  return (
    <div className="text-center py-12">
      {props.validationResult === 'success' ? (
        <>
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-green-600 mb-2">Success!</h2>
            <p className="text-gray-600 text-lg">
              You have successfully passed the CAPTCHA verification.
            </p>
          </div>
          <div className="mt-8">
            <Button onClick={props.handleRetry}>Try Again</Button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
              <svg
                className="w-12 h-12 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-red-600 mb-2">Failed!</h2>
            <p className="text-gray-600 text-lg">
              The CAPTCHA verification failed. Please try again.
            </p>
          </div>
          <div className="mt-8">
            <Button onClick={props.handleRetry}>Retry</Button>
          </div>
        </>
      )}
    </div>
  );
};
