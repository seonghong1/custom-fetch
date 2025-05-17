/**
 * @typedef {Object} FetchOptions
 * @property {string} [method='POST'] - HTTP 메서드
 * @property {string} [baseURL=''] - 기본 URL
 * @property {'json'|'text'|'blob'} [responseType='json'] - 응답 데이터 타입
 * @property {Object.<string, any>} [params=null] - URL 쿼리 파라미터
 * @property {Object|FormData|null} [data=null] - 요청 본문 데이터
 * @property {number} [timeout=0] - 요청 타임아웃 시간(ms)
 * @property {Function|null} [successCallback=null] - 요청 성공 시 실행할 콜백 함수
 * @property {Function|null} [errorCallback=null] - 요청 실패 시 실행할 콜백 함수
 */

/**
 * HTTP 요청을 처리하는 커스텀 fetch 래퍼 함수
 *
 * @param {string} url - 요청할 엔드포인트 URL
 * @param {FetchOptions} options - 요청 옵션
 * @returns {Promise<any>} - 요청 성공 시 응답 데이터를 반환하고, 실패 시 예외를 throw
 */
export const customFetch = async (url, options) => {
    const {
        method = 'POST',
        baseURL = '',
        responseType = 'json',
        params = null,
        data = null,
        timeout = 0,
        successCallback = null,
        errorCallback = null,
    } = options;

    // 타임아웃 설정
    const controller = new AbortController();
    const timeoutId = timeout
        ? setTimeout(() => controller.abort(), timeout)
        : null;

    try {
        // URL 생성
        const fullUrl = createFullUrl(url, baseURL, params);

        // 요청 설정
        const requestConfig = createRequestConfig(method, data, controller);

        // 요청 실행
        const response = await fetch(fullUrl, requestConfig);

        // 응답 처리
        return await handleResponse(
            response,
            responseType,
            successCallback,
            errorCallback,
        );
    } catch (error) {
        handleError(error);
    } finally {
        cleanupTimeout(timeoutId);
    }
};

// URL 생성 헬퍼 함수
const createFullUrl = (url, baseURL, params) => {
    const queryString = params
        ? '?' + new URLSearchParams(params).toString()
        : '';
    return `${baseURL}${url}${queryString}`;
};

// 요청 설정 생성 헬퍼 함수
const createRequestConfig = (method, data, controller) => {
    return {
        method,
        body: data ? JSON.stringify(data) : null,
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + getToken(),
        },
        signal: controller.signal,
    };
}


// 응답 처리 헬퍼 함수
const handleResponse = async (
    response,
    responseType,
    successCallback,
    errorCallback,
) => {
    if (!response.ok) {
        if (errorCallback) {
            errorCallback(response);
        }
        return;
    }

    const responseData = await parseResponse(response, responseType);

    if (successCallback) {
        successCallback(responseData);
    }

    return responseData;
};

// 응답 데이터 파싱 헬퍼 함수
const parseResponse = async (response, responseType) => {
    const parsers = {
        json: () => response.json(),
        text: () => response.text(),
        blob: () => response.blob(),
    };

    return await parsers[responseType]();
};

// 에러 처리 헬퍼 함수
const handleError = (error) => {
    console.error('Fetch error:', error);

    if (error.name === 'AbortError') {
        console.error('Request timeout');
    }

    alert(error);
    throw error;
};

// 타임아웃 정리 헬퍼 함수
const cleanupTimeout = (timeoutId) => {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
};

// 토큰 가져오기 헬퍼 함수
const getToken = () => {
  // 실제 구현 필요 (예: localStorage, 쿠키 등)
  return '어딘가의 토큰값';
};
