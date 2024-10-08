/**
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

/**
 * This test is mainly to verify that the storage pressure event is fired when
 * the eviction process is not able to free some space when a quota client
 * attempts to write over the global limit or when the global limit is reduced
 * below the global usage.
 */

const { TestUtils } = ChromeUtils.importESModule(
  "resource://testing-common/TestUtils.sys.mjs"
);

loadScript("dom/quota/test/common/file.js");

async function awaitStoragePressure() {
  const [subject] = await TestUtils.topicObserved(
    "QuotaManager::StoragePressure"
  );
  const usage = subject.QueryInterface(Ci.nsISupportsPRUint64).data;
  return usage;
}

async function testSteps() {
  const globalLimitKB = 2;

  const principal = getPrincipal("https://example.com");

  info("Setting limits");

  setGlobalLimit(globalLimitKB);

  info("Initializing");

  let request = init();
  await requestFinished(request);

  info("Initializing temporary storage");

  request = initTemporaryStorage();
  await requestFinished(request);

  info("Persisting and filling an origin");

  // We need to persist the origin first to omit the group limit checks.
  // Otherwise, we would have to fill five separate origins.
  request = persist(principal);
  await requestFinished(request);

  let database = getSimpleDatabase(principal);

  request = database.open("data");
  await requestFinished(request);

  try {
    request = database.write(getBuffer(globalLimitKB * 1024));
    await requestFinished(request);

    ok(true, "Should not have thrown");
  } catch (ex) {
    ok(false, "Should not have thrown");
  }

  info("Testing storage pressure by writing over the global limit");

  info("Storing one more byte to get the storage pressure event while writing");

  let promiseStoragePressure = awaitStoragePressure();

  try {
    request = database.write(getBuffer(1));
    await requestFinished(request);

    ok(false, "Should have thrown");
  } catch (e) {
    ok(true, "Should have thrown");
    Assert.strictEqual(
      e.resultCode,
      NS_ERROR_FILE_NO_DEVICE_SPACE,
      "Threw right result code"
    );
  }

  info("Checking the storage pressure event");

  let usage = await promiseStoragePressure;
  Assert.equal(usage, globalLimitKB * 1024, "Got correct usage");

  info("Testing storage pressure by reducing the global limit");

  info(
    "Reducing the global limit to get the storage pressuse event while the" +
      " temporary storage is being initialized"
  );

  setGlobalLimit(globalLimitKB - 1);

  request = reset();
  await requestFinished(request);

  info("Initializing");

  request = init();
  await requestFinished(request);

  promiseStoragePressure = awaitStoragePressure();

  info("Initializing temporary storage");

  request = initTemporaryStorage();
  await requestFinished(request);

  info("Checking the storage pressure event");

  usage = await promiseStoragePressure;
  Assert.equal(usage, globalLimitKB * 1024, "Got correct usage");

  info("Resetting limits");

  resetGlobalLimit();

  request = reset();
  await requestFinished(request);
}
