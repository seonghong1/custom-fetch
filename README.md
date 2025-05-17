# ✨ customFetch 사용 예제

```js
import { customFetch } from './customFetch'; // 경로는 프로젝트에 맞게 수정
```
## ✅ 기본 사용
```javascript
await customFetch('/api/users', {
  data: { name: 'John' }
});
```

## 🔧 모든 옵션 사용
```javascript
await customFetch('/api/users', {
  method: 'POST',
  baseURL: 'https://api.example.com',
  responseType: 'json',  // 'json' | 'text' | 'blob'
  params: { page: 1 },
  data: { name: 'John' },
  timeout: 5000, // 5초 후 타임아웃
  successCallback: (res) => console.log('성공:', res),
  errorCallback: (err) => console.error('에러:', err),
});
```

## ⚠️ 에러 처리
customFetch는 HTTP 상태 코드가 실패(예: 4xx, 5xx)인 경우 Error를 throw합니다.
에러는 try...catch 또는 errorCallback을 통해 핸들링할 수 있습니다.
```javascript
try {
  const result = await customFetch('/api/error-test', { method: 'GET' });
  console.log(result);
} catch (error) {
  console.error('요청 실패:', error);
}
```

## 📌 주요 옵션 설명
| 옵션명               | 타입                               | 기본값    | 설명            |
| ----------------- | -------------------------------- | ------ | ----------------- |
| `method`          | 'GET'                            | `'POST'` | HTTP 메서드  |
| `baseURL`         | `string`                         | `''`   | 기본 URL 경로       |
| `responseType`    | 'json'                           | `'json'` | 응답 데이터 타입 |
| `params`          | `object`                         | `null` | URL 쿼리 파라미터       |
| `data`            | `object` \| `FormData` \| `null` | `null` | 요청 본문 데이터         |
| `timeout`         | `number` (ms)                    | `0`    | 요청 타임아웃 (0이면 무제한) |
| `successCallback` | `function` \| `null`             | `null` | 요청 성공 시 실행될 콜백    | 
| `errorCallback`   | `function` \| `null`             | `null` | 요청 실패 시 실행될 콜백    |  

