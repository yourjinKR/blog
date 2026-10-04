---
date: 2026-07-23
title: MySQL
tags:
  - DB
  - MySQL
---
# 기본 명령어

```mysql
SHOW DATABASES
```

![[Pasted image 20260723031024.png|259]]

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

![[Pasted image 20260723030735.png]]



