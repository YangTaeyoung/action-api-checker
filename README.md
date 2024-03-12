# Hello Action API Checker! 👋
해당 액션은 Github Action 중 특정 API에 요청하고, 기대하는 결과가 맞을 때까지 반복적으로 요청하는 액션입니다.

## 이런 상황에서 추천합니다.
- 배포 전, 배포 후에 특정 API를 통해 배포가 정상적으로 이루어졌는지 확인하고 싶을 때
- Github Action 과정에서 특정 API의 동작이 결과와 일치하는지 확인하고 싶을 때
- 특정 API의 결과가 원하는 값이 나올 때까지 반복적으로 확인하고 싶을 때

## 사용 방법
API를 체크하고 싶은 단계에 다음을 추가합니다.


with 내에 사용 가능한 파라미터에 대한 자세한 명세는 [action.yml](./action.yml)을 참고하세요.

```yaml
# In your workflow file

# job, steps, etc 
# ... 

      - name: API Health Check
        uses: YangTaeyoung/action-api-checker@v0.0.1
        with:
          url: "http://your-health-check-api.com/path"
          method: "GET" # GET, POST, PUT, DELETE, PATCH 등
          expected_status: "200" # 기대하는 상태 코드
          expected_body: "{\"health\":true}" # 기대하는 응답 body
          max_retries: "10" # 최대 재시도 횟수

# after health check
# ...
```