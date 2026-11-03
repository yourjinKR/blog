---
date: 2026-07-23
tags:
  - DB
  - MySQL
---
# 기본 명령어

## MySQL 접속 및 데이터베이스 선택

실행한 다음 Password 입력 후 접속 가능 

```sh
mysql -u [사용자계정명] -p [데이터베이스명]
```

utf8mb4로 접속 (한글 데이터 확인)

```sh
mysql -u [사용자계정명] -p [데이터베이스명] --default-character-set=utf8mb4
```

## 데이터베이스

```mysql
SHOW DATABASES
```

![[IMG-20261013035042098-1.png|259]]

### 데이터베이스 생성

`CREATE DATABASE [DB명] CHARACTER SET [character-set] COLLATE [collate-set]`

```sql
CREATE DATABASE mydb CHARACTER SET utf8 COLLATE utf8_bin;
```

### 데이터베이스 접속

```mysql
USE mydb;
```

# 도커로 실행

```shell
docker pull mysql:latest
```

```shell
docker run --name mysql-test -e MYSQL_ROOT_PASSWORD=password -d -p 3309:3306 mysql:latest
```

```shell
docker exec -it mysql-test bash
```

```bash
mysql -u root -p
```

![[IMG-20261013035042098-2.png]]



