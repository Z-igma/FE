// Service Worker
self.__WB_MANIFEST; //VitePWA가 파일 캐시 목록을 넣어주는 자리

self.addEventListener('push', event => {
  const data = event.data?.json();

  event.waitUntil(
    self.registration.showNotification(data?.title ?? '알림', {
      body: data?.body ?? '',
      icon: '/icon.png',
    })
  );
});
