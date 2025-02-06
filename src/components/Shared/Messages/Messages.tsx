import { message } from 'antd';

export const SuccessMessage = ({description}: { description: string }) => {
  message.success({
    content: description,
    duration: 3.5,
    key: description,
  });
};


export const InfoMessage = ({description}: { description: string }) => {
  message.info({
    content: description,
    duration: 3.5,
    key: description,
  });
};

export const LoadingMessage = (description: string, duration: number) => {
  message.loading({content: description, duration: duration, key: description,});
  
};
export const WarningMessage = ({description}: { description: string }) => {
  message.warning({
    content: description,
    duration: 3.5,
    key: description,
  });
};
export const ErrorMessage = ({description}: { description: string }) => {
  message.error({
    content: description,
    duration: 5,
    key: description,
  });
};

message.config({
  maxCount: 2
});
