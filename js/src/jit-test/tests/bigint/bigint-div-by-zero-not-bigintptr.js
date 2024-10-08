// Fallible BigInt division should have a resume point and its alias set
// should record that exceptions can be thrown.
function resumeAfterException(t) {
  for (var i = 0; i < 2; i++) {
    try {
      var x = 1;
      1_0000_0000_0000_0000n / 1n;
      x = 2;
      1_0000_0000_0000_0000n / t;
    } catch (e) {
      assertEq(x, 2);
    }
  }
}
resumeAfterException(1n);
resumeAfterException(0n);
