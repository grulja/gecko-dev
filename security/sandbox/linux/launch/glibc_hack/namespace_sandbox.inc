#if defined(LIBC_GLIBC)
// The first few fields of glibc's struct pthread.  The full
// definition is in:
// https://sourceware.org/git/?p=glibc.git;a=blob;f=nptl/descr.h;hb=95a73392580761abc62fc9b1386d232cd55878e9#l121
struct glibc_pthread {
  union {
#if defined(ARCH_CPU_X86_64)
    // On x86_64, sizeof(tcbhead_t) > sizeof(void*)*24.
    // https://sourceware.org/git/?p=glibc.git;a=blob;f=sysdeps/x86_64/nptl/tls.h;hb=95a73392580761abc62fc9b1386d232cd55878e9#l65
    // For all other architectures, sizeof(tcbhead_t) <= sizeof(void*)*24.
    // https://sourceware.org/git/?p=glibc.git&a=search&h=HEAD&st=grep&s=%7D+tcbhead_t
    char header[704];
#endif
    void* padding[24];
  } header;
  void* list[2];
  pid_t tid;
};

pid_t GetGlibcCachedTid() {
  pthread_mutex_t lock = PTHREAD_RECURSIVE_MUTEX_INITIALIZER_NP;
  CHECK_EQ(0, pthread_mutex_lock(&lock));
  pid_t tid = lock.__data.__owner;
  CHECK_EQ(0, pthread_mutex_unlock(&lock));
  CHECK_EQ(0, pthread_mutex_destroy(&lock));
  return tid;
}

void MaybeUpdateGlibcTidCache() {
  // After the below CL, glibc does not does not reset the cached
  // TID/PID on clone(), but pthread depends on it being up-to-date.
  // This CL was introduced in glibc 2.25, and backported to 2.24 on
  // at least Debian and Fedora.  This is a workaround that updates
  // the cache manually.
  // https://sourceware.org/git/?p=glibc.git;a=commit;h=c579f48edba88380635ab98cb612030e3ed8691e
  pid_t real_tid = sys_gettid();
  pid_t cached_tid = GetGlibcCachedTid();
  if (cached_tid != real_tid) {
    pid_t* cached_tid_location =
        &reinterpret_cast<struct glibc_pthread*>(pthread_self())->tid;
    CHECK_EQ(cached_tid, *cached_tid_location);
    *cached_tid_location = real_tid;
    CHECK_EQ(real_tid, GetGlibcCachedTid());
  }
}
#endif  // defined(LIBC_GLIBC)