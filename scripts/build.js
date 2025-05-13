const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// 프로젝트 루트 경로
const projectRoot = path.resolve(__dirname, '..');

// 배포 빌드를 실행하기 전에 필요한 준비 작업 수행
function prepareBuild() {
  console.log('빌드 준비 작업 시작...');
  
  // src/app 콘텐츠를 app 디렉토리로 복사
  const srcAppDir = path.join(projectRoot, 'src', 'app');
  const appDir = path.join(projectRoot, 'app');
  
  // app 디렉토리가 없으면 생성
  if (!fs.existsSync(appDir)) {
    fs.mkdirSync(appDir, { recursive: true });
  }
  
  // src/app의 모든 파일 및 폴더를 app으로 복사
  copyRecursive(srcAppDir, appDir);
  
  console.log('빌드 준비 작업 완료');
}

// 재귀적으로 디렉토리 복사하는 함수
function copyRecursive(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursive(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 빌드 후 정리 작업
function cleanupAfterBuild() {
  console.log('빌드 후 정리 작업 시작...');
  
  // 임시로 생성한 app 디렉토리 제거
  const appDir = path.join(projectRoot, 'app');
  if (fs.existsSync(appDir)) {
    fs.rmSync(appDir, { recursive: true, force: true });
  }
  
  console.log('빌드 후 정리 작업 완료');
}

// 메인 빌드 프로세스
function build() {
  try {
    // 빌드 준비
    prepareBuild();
    
    // Next.js 빌드 실행
    console.log('Next.js 빌드 실행 중...');
    execSync('npx next build', { stdio: 'inherit', cwd: projectRoot });
    
    console.log('빌드 성공!');
  } catch (error) {
    console.error('빌드 실패:', error);
    process.exit(1);
  } finally {
    // 정리 작업
    cleanupAfterBuild();
  }
}

// 빌드 실행
build();