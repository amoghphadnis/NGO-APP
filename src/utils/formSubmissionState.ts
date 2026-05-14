export type SubmissionState = 
  | 'idle'
  | 'validating'
  | 'preparing'
  | 'uploading'
  | 'success'
  | 'error';

export type SubmissionAction = {
  type: 'SUBMIT' | 'RETRY' | 'CANCEL' | 'ERROR' | 'SUCCESS';
  payload?: any;
};

export interface FormSubmissionState {
  state: SubmissionState;
  error?: string | { message: string };
  progress?: number;
  canRetry: boolean;
  canCancel: boolean;
}

export const createInitialSubmissionState = (): FormSubmissionState => ({
  state: 'idle',
  canRetry: false,
  canCancel: false,
});

export const submissionStateReducer = (
  state: FormSubmissionState,
  action: SubmissionAction
): FormSubmissionState => {
  switch (action.type) {
    case 'SUBMIT':
      return {
        ...state,
        state: 'validating',
        error: undefined,
        canRetry: false,
        canCancel: true,
      };
      
    case 'RETRY':
      return {
        ...state,
        state: 'preparing',
        error: undefined,
        canRetry: false,
        canCancel: true,
      };
      
    case 'CANCEL':
      return {
        ...state,
        state: 'idle',
        error: undefined,
        canRetry: false,
        canCancel: false,
      };
      
    default:
      return state;
  }
};

export const canSubmit = (state: FormSubmissionState): boolean => {
  return state.state === 'idle' || state.state === 'error';
};

export const isSubmitting = (state: FormSubmissionState): boolean => {
  return state.state === 'validating' || state.state === 'preparing' || state.state === 'uploading';
};

export const hasError = (state: FormSubmissionState): boolean => {
  return state.state === 'error';
};

export const isSuccess = (state: FormSubmissionState): boolean => {
  return state.state === 'success';
};
