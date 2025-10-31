# Easiest CV

> CV: Curriculum Vitae. 이력서. (= Résumé)
> 대학교수의 이력서를 한정해 의미하기도 함.

가장 심플한 연구자 학술 개인 홈페이지 제작 툴.<br/>
내용만 채우세요! 디자인 고민도, 복잡한 사이트 관리도 없습니다.<br/>

철학과 박사과정생 지인의 요청으로 시작된 프로젝트로, 연구 업적과 이력을 간단히 정리하고자 하는 인문학 및 사회과학 분야의 교수 및 연구자를 대상으로 기획된 서비스입니다. <br/>
디자인도 레이아웃도 귀찮고 기존의 홈페이지 제작 툴조차 배우기 어려울 때, <br/>
컴퓨터로 이메일 보낼 줄 아는 수준이면 충분한, 오직 내용만 입력해서 CV 웹사이트를 만들 수 있는 서비스.<br/>

배포 주소: https://easiest-cv.com/ <br/>
ID: tutorial / PW: easiestcv

# Database Schema

```mermaid
erDiagram
    users ||--|| userinfo : has
    users ||--o{ documents : owns
    users ||--o{ tabs : owns
    tabs ||--o| attachments : contains

    users {
        varchar userid PK
        varchar username
        varchar password
        varchar email
    }

    userinfo {
        varchar userid PK 
        text intro
        varchar img
        varchar meta_title  
        varchar meta_description 
    }

    documents {
        int id PK
        varchar userid FK
        varchar url
    }

    tabs {
        int tid PK
        varchar userid FK
        varchar tname
        int torder
        text contents
    }

    attachments {
        varchar userid PK, FK 
        int tid PK, FK 
        array files
    }


```

## Tables

### users

사용자 계정 정보를 저장합니다.

- userid: 사용자 고유 식별자 (Primary Key)
- username: 사용자명
- password: 암호화된 비밀번호
- email: 이메일 주소

### userinfo

사용자 프로필 정보를 저장합니다.

- userid: 사용자 식별자 (Primary Key, Foreign Key → users)
- home_intro: home 탭의 자기소개
- home_img: home 탭 이미지의 GCS URL
- meta_title: 웹페이지 제목
- meta_description: 웹페이지 설명

### documents

파일 탭의 문서 파일 정보를 저장합니다.

- id: 문서 고유 식별자 (Primary Key, 자동 증가)
- userid: 사용자 식별자 (Foreign Key → users)
- url: 파일 저장 경로 또는 URL (GCS, S3 등)

### tabs

사용자의 탭 정보를 저장합니다.

- tid: 탭 고유 식별자 (Primary Key)
- userid: 사용자 식별자 (Foreign Key → users)
- tname: 탭 이름
- torder: 탭 정렬 순서
- contents: 탭 내용

### attachments

탭 내용 안에 첨부된 파일 정보를 저장합니다.

- userid: 사용자 식별자 (Composite Primary Key, Foreign Key → users)
- tid: 탭 식별자 (Composite Primary Key, Foreign Key → tabs)
- files: 파일이 첨부된 GCS의 url 문자열 배열
