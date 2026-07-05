// FutureKawa — CI/CD pipeline
//
// Prerequisites on the Jenkins agent: Node.js 20+, npm, Docker (with the
// daemon reachable from the agent, for the packaging stage).
//
// Stages: install -> lint -> unit tests -> build -> integration tests
// (against a real Postgres started for the duration of the stage) -> Docker
// packaging of every service image. Fails fast: any stage failure stops the
// pipeline and later stages are skipped.

pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  environment {
    CI = 'true'
    POSTGRES_USER = 'postgres'
    POSTGRES_PASSWORD = 'password'
    POSTGRES_DB = 'mydb'
    DATABASE_URL = "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:55432/${POSTGRES_DB}?schema=public"
  }

  stages {
    stage('Install dependencies') {
      steps {
        sh 'npm ci'
        // Country-api and alerting-service import the generated @prisma/client
        // (types, enums) even in unit tests — without this, lint/test/build
        // fail with "Cannot find module '.prisma/client/default'".
        sh 'npx prisma generate --schema=prisma/schema.prisma'
      }
    }

    stage('Lint') {
      steps {
        sh 'npx nx run-many -t lint --skip-nx-cache'
      }
    }

    stage('Unit tests') {
      steps {
        sh 'npx nx run-many -t test --skip-nx-cache'
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: 'coverage/**/junit.xml'
        }
      }
    }

    stage('Build') {
      steps {
        sh 'npx nx run-many -t build --skip-nx-cache'
      }
    }

    stage('Integration tests (country-api)') {
      steps {
        sh '''
          docker run -d --rm --name ci-postgres-country-api \
            -e POSTGRES_USER=$POSTGRES_USER \
            -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
            -e POSTGRES_DB=$POSTGRES_DB \
            -p 55432:5432 \
            postgres:17-alpine

          until docker exec ci-postgres-country-api pg_isready -U $POSTGRES_USER >/dev/null 2>&1; do sleep 1; done

          npx prisma db push --schema prisma/schema.prisma --accept-data-loss
          SEED_COUNTRY=BR npx prisma db seed
          npx nx test-e2e country-api --skip-nx-cache
        '''
      }
      post {
        always {
          sh 'docker stop ci-postgres-country-api || true'
        }
      }
    }

    stage('Docker image packaging') {
      steps {
        sh 'docker compose build country-api-bresil gateway alerting-bresil fe'
      }
    }
  }

  post {
    success {
      echo 'FutureKawa pipeline succeeded — images built and ready to publish/deploy.'
    }
    failure {
      echo 'FutureKawa pipeline failed — see the failing stage above for details.'
    }
  }
}
