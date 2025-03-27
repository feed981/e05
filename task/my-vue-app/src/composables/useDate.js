import dayjs from 'dayjs';

export function useDate() {

    // 設定日期為當天的 YYYY-MM-DD 格式
    const setDate = () => {
        return dayjs().format('YYYY-MM-DD');
    };

    const formatDateTime = (timestamp) => {
        return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
      };

    return {
        setDate,
        formatDateTime,
    };
}