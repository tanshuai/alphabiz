(function (Q, ee) {
  typeof exports == "object" && typeof module != "undefined" ? ee(exports) : typeof define == "function" && define.amd ? define(["exports"], ee) : (Q = Q || self, ee(Q.LZMA = {}))
})(globalThis.exports, function (Q) {
  "use strict";
  var ee = 1,
    je = 2,
    Tr = 3,
    re = typeof setImmediate == "function" ? setImmediate : setTimeout,
    I = 4294967296,
    De = [4294967295, -I],
    Wr = [0, -9223372036854776e3],
    H = [0, 0],
    Ye = [1, 0];
  function Ke(e, r) {
    postMessage({
      action: Tr,
      cbn: r,
      result: e
    })
  }
  function v(e) {
    var r = [];
    return r[e - 1] = void 0, r
  }
  function K(e, r) {
    return xe(e[0] + r[0], e[1] + r[1])
  }
  function Ue(e, r) {
    return Hr(~~Math.max(Math.min(e[1] / I, 2147483647), -2147483648) & ~~Math.max(Math.min(r[1] / I, 2147483647), -2147483648), O(e) & O(r))
  }
  function ne(e, r) {
    var n, o;
    return e[0] == r[0] && e[1] == r[1] ? 0 : (n = e[1] < 0, o = r[1] < 0, n && !o ? -1 : !n && o ? 1 : Xe(e, r)[1] < 0 ? -1 : 1)
  }
  function xe(e, r) {
    var n, o;
    for (r %= 18446744073709552e3, e %= 18446744073709552e3, n = r % I, o = Math.floor(e / I) * I, r = r - n + o, e = e - o + n; e < 0;) e += I, r -= I;
    for (; e > 4294967295;) e -= I, r += I;
    for (r = r % 18446744073709552e3; r > 9223372032559809e3;) r -= 18446744073709552e3;
    for (; r < -9223372036854776e3;) r += 18446744073709552e3;
    return [e, r]
  }
  function qe(e, r) {
    return e[0] == r[0] && e[1] == r[1]
  }
  function X(e) {
    return e >= 0 ? [e, 0] : [e + I, -I]
  }
  function O(e) {
    return e[0] >= 2147483648 ? ~~Math.max(Math.min(e[0] - I, 2147483647), -2147483648) : ~~Math.max(Math.min(e[0], 2147483647), -2147483648)
  }
  function Hr(e, r) {
    var n, o;
    return n = e * I, o = r, r < 0 && (o += I), [o, n]
  }
  function we(e) {
    return e <= 30 ? 1 << e : we(30) * we(e - 30)
  }
  function Je(e, r) {
    var n, o, _, f;
    if (r &= 63, qe(e, Wr)) return r ? H : e;
    if (e[1] < 0) throw new Error("Neg");
    return f = we(r), o = e[1] * f % 18446744073709552e3, _ = e[0] * f, n = _ - _ % I, o += n, _ -= n, o >= 9223372036854776e3 && (o -= 18446744073709552e3), [_, o]
  }
  function Qe(e, r) {
    var n;
    return r &= 63, n = we(r), xe(Math.floor(e[0] / n), e[1] / n)
  }
  function Zr(e, r) {
    var n;
    return r &= 63, n = Qe(e, r), e[1] < 0 && (n = K(n, Je([2, 0], 63 - r))), n
  }
  function Xe(e, r) {
    return xe(e[0] - r[0], e[1] - r[1])
  }
  function ce(e, r) {
    return e.buf = r, e.pos = 0, e.count = r.length, e
  }
  function oe(e) {
    return e.pos >= e.count ? -1 : e.buf[e.pos++] & 255
  }
  function Vr(e, r, n, o) {
    return e.pos >= e.count ? -1 : (o = Math.min(o, e.count - e.pos), ie(e.buf, e.pos, r, n, o), e.pos += o, o)
  }
  function ae(e) {
    return e.buf = v(32), e.count = 0, e
  }
  function ye(e) {
    var r = e.buf;
    return r.length = e.count, r
  }
  function he(e, r) {
    e.buf[e.count++] = r << 24 >> 24
  }
  function $e(e, r, n, o) {
    ie(r, n, e.buf, e.count, o), e.count += o
  }
  function jr(e, r, n, o, _) {
    var f;
    for (f = r; f < n; ++f) o[_++] = e.charCodeAt(f)
  }
  function ie(e, r, n, o, _) {
    for (var f = 0; f < _; ++f) n[o + f] = e[r + f]
  }
  function Yr(e, r) {
    Ln(r, 1 << e.s), r._numFastBytes = e.f, Fn(r, e.m), r._numLiteralPosStateBits = 0, r._numLiteralContextBits = 3, r._posStateBits = 2, r._posStateMask = 3
  }
  function Kr(e, r, n, o, _) {
    var f, u;
    if (ne(o, De) < 0) throw new Error("invalid length " + o);
    for (e.length_0 = o, f = wn({}), Yr(_, f), In(f, n), u = 0; u < 64; u += 8) he(n, O(Qe(o, u)) & 255);
    e.chunker = (f._needReleaseMFStream = 0, f._inStream = r, f._finished = 0, Dn(f), f._rangeEncoder.Stream = n, En(f), vr(f), Br(f), f._lenEncoder._tableSize = f._numFastBytes + 1 - 2, wr(f._lenEncoder, 1 << f._posStateBits), f._repMatchLenEncoder._tableSize = f._numFastBytes + 1 - 2, wr(f._repMatchLenEncoder, 1 << f._posStateBits), f.nowPos64 = H, en({}, f))
  }
  function se(e, r, n) {
    return e.output = ae({}), Kr(e, ce({}, r), e.output, X(r.length), n), e
  }
  function Ur(e, r, n) {
    var o, _ = "",
      f, u = [],
      m, p;
    for (f = 0; f < 5; ++f) {
      if (m = oe(r), m == -1) throw new Error("truncated input");
      u[f] = m << 24 >> 24
    }
    if (o = un({}), !dn(o, u)) throw new Error("corrupted input");
    for (f = 0; f < 64; f += 8) {
      if (m = oe(r), m == -1) throw new Error("truncated input");
      m = m.toString(16), m.length == 1 && (m = "0" + m), _ = m + "" + _
    }
    /^0+$|^f+$/i.test(_) ? e.length_0 = De : (p = parseInt(_, 16), p > 4294967295 ? e.length_0 = De : e.length_0 = X(p)), e.chunker = _n(o, r, n, e.length_0)
  }
  function te(e, r) {
    return e.output = ae({}), Ur(e, ce({}, r), e.output), e
  }
  function qr(e, r, n, o) {
    var _;
    e._keepSizeBefore = r, e._keepSizeAfter = n, _ = r + n + o, (e._bufferBase == null || e._blockSize != _) && (e._bufferBase = null, e._blockSize = _, e._bufferBase = v(e._blockSize)), e._pointerToLastSafePosition = e._blockSize - n
  }
  function G(e, r) {
    return e._bufferBase[e._bufferOffset + e._pos + r]
  }
  function _e(e, r, n, o) {
    var _, f;
    for (e._streamEndWasReached && e._pos + r + o > e._streamPos && (o = e._streamPos - (e._pos + r)), ++n, f = e._bufferOffset + e._pos + r, _ = 0; _ < o && e._bufferBase[f + _] == e._bufferBase[f + _ - n]; ++_);
    return _
  }
  function Be(e) {
    return e._streamPos - e._pos
  }
  function Jr(e) {
    var r, n, o;
    for (o = e._bufferOffset + e._pos - e._keepSizeBefore, o > 0 && --o, n = e._bufferOffset + e._streamPos - o, r = 0; r < n; ++r) e._bufferBase[r] = e._bufferBase[o + r];
    e._bufferOffset -= o
  }
  function Qr(e) {
    var r;
    e._pos += 1, e._pos > e._posLimit && (r = e._bufferOffset + e._pos, r > e._pointerToLastSafePosition && Jr(e), er(e))
  }
  function er(e) {
    var r, n, o;
    if (!e._streamEndWasReached)
      for (;;) {
        if (o = -e._bufferOffset + e._blockSize - e._streamPos, !o) return;
        if (r = Vr(e._stream, e._bufferBase, e._bufferOffset + e._streamPos, o), r == -1) {
          e._posLimit = e._streamPos, n = e._bufferOffset + e._posLimit, n > e._pointerToLastSafePosition && (e._posLimit = e._pointerToLastSafePosition - e._bufferOffset), e._streamEndWasReached = 1;
          return
        }
        e._streamPos += r, e._streamPos >= e._pos + e._keepSizeAfter && (e._posLimit = e._streamPos - e._keepSizeAfter)
      }
  }
  function rr(e, r) {
    e._bufferOffset += r, e._posLimit -= r, e._pos -= r, e._streamPos -= r
  }
  var Ce = function () {
    var e, r, n, o = [];
    for (e = 0; e < 256; ++e) {
      for (n = e, r = 0; r < 8; ++r)(n & 1) != 0 ? (n >>>= 1, n ^= -306674912) : n >>>= 1;
      o[e] = n
    }
    return o
  }();
  function Xr(e, r, n, o, _) {
    var f, u, m;
    r < 1073741567 && (e._cutValue = 16 + (o >> 1), m = ~~((r + n + o + _) / 2) + 256, qr(e, r + n, o + _, m), e._matchMaxLen = o, f = r + 1, e._cyclicBufferSize != f && (e._son = v((e._cyclicBufferSize = f) * 2)), u = 65536, e.HASH_ARRAY && (u = r - 1, u |= u >> 1, u |= u >> 2, u |= u >> 4, u |= u >> 8, u >>= 1, u |= 65535, u > 16777216 && (u >>= 1), e._hashMask = u, u += 1, u += e.kFixHashSize), u != e._hashSizeSum && (e._hash = v(e._hashSizeSum = u)))
  }
  function cr(e, r) {
    var n, o, _, f, u, m, p, d, l, w, S, k, L, P, R, E, M, Z, z, V, U;
    if (e._pos + e._matchMaxLen <= e._streamPos) P = e._matchMaxLen;
    else if (P = e._streamPos - e._pos, P < e.kMinMatchCheck) return Ee(e), 0;
    for (M = 0, R = e._pos > e._cyclicBufferSize ? e._pos - e._cyclicBufferSize : 0, o = e._bufferOffset + e._pos, E = 1, d = 0, l = 0, e.HASH_ARRAY ? (U = Ce[e._bufferBase[o] & 255] ^ e._bufferBase[o + 1] & 255, d = U & 1023, U ^= (e._bufferBase[o + 2] & 255) << 8, l = U & 65535, w = (U ^ Ce[e._bufferBase[o + 3] & 255] << 5) & e._hashMask) : w = e._bufferBase[o] & 255 ^ (e._bufferBase[o + 1] & 255) << 8, _ = e._hash[e.kFixHashSize + w] || 0, e.HASH_ARRAY && (f = e._hash[d] || 0, u = e._hash[1024 + l] || 0, e._hash[d] = e._pos, e._hash[1024 + l] = e._pos, f > R && e._bufferBase[e._bufferOffset + f] == e._bufferBase[o] && (r[M++] = E = 2, r[M++] = e._pos - f - 1), u > R && e._bufferBase[e._bufferOffset + u] == e._bufferBase[o] && (u == f && (M -= 2), r[M++] = E = 3, r[M++] = e._pos - u - 1, f = u), M != 0 && f == _ && (M -= 2, E = 1)), e._hash[e.kFixHashSize + w] = e._pos, z = (e._cyclicBufferPos << 1) + 1, V = e._cyclicBufferPos << 1, k = L = e.kNumHashDirectBytes, e.kNumHashDirectBytes != 0 && _ > R && e._bufferBase[e._bufferOffset + _ + e.kNumHashDirectBytes] != e._bufferBase[o + e.kNumHashDirectBytes] && (r[M++] = E = e.kNumHashDirectBytes, r[M++] = e._pos - _ - 1), n = e._cutValue;;) {
      if (_ <= R || n == 0) {
        n -= 1, e._son[z] = e._son[V] = 0;
        break
      }
      if (p = e._pos - _, m = (p <= e._cyclicBufferPos ? e._cyclicBufferPos - p : e._cyclicBufferPos - p + e._cyclicBufferSize) << 1, Z = e._bufferOffset + _, S = k < L ? k : L, e._bufferBase[Z + S] == e._bufferBase[o + S]) {
        for (;
          (S += 1) != P && e._bufferBase[Z + S] == e._bufferBase[o + S];);
        if (E < S && (r[M++] = E = S, r[M++] = p - 1, S == P)) {
          e._son[V] = e._son[m], e._son[z] = e._son[m + 1];
          break
        }
      }(e._bufferBase[Z + S] & 255) < (e._bufferBase[o + S] & 255) ? (e._son[V] = _, V = m + 1, _ = e._son[V], L = S) : (e._son[z] = _, z = m, _ = e._son[z], k = S)
    }
    return Ee(e), M
  }
  function ar(e) {
    e._bufferOffset = 0, e._pos = 0, e._streamPos = 0, e._streamEndWasReached = 0, er(e), e._cyclicBufferPos = 0, rr(e, -1)
  }
  function Ee(e) {
    var r;
    (e._cyclicBufferPos += 1) >= e._cyclicBufferSize && (e._cyclicBufferPos = 0), Qr(e), e._pos == 1073741823 && (r = e._pos - e._cyclicBufferSize, nr(e._son, e._cyclicBufferSize * 2, r), nr(e._hash, e._hashSizeSum, r), rr(e, r))
  }
  function nr(e, r, n) {
    var o, _;
    for (o = 0; o < r; ++o) _ = e[o] || 0, _ <= n ? _ = 0 : _ -= n, e[o] = _
  }
  function hr(e, r) {
    e.HASH_ARRAY = r > 2, e.HASH_ARRAY ? (e.kNumHashDirectBytes = 0, e.kMinMatchCheck = 4, e.kFixHashSize = 66560) : (e.kNumHashDirectBytes = 2, e.kMinMatchCheck = 3, e.kFixHashSize = 0)
  }
  function $r(e, r) {
    var n, o, _, f, u, m, p, d, l, w, S, k, L, P, R, E, M;
    do {
      if (e._pos + e._matchMaxLen <= e._streamPos) k = e._matchMaxLen;
      else if (k = e._streamPos - e._pos, k < e.kMinMatchCheck) {
        Ee(e);
        continue
      }
      for (L = e._pos > e._cyclicBufferSize ? e._pos - e._cyclicBufferSize : 0, o = e._bufferOffset + e._pos, e.HASH_ARRAY ? (M = Ce[e._bufferBase[o] & 255] ^ e._bufferBase[o + 1] & 255, m = M & 1023, e._hash[m] = e._pos, M ^= (e._bufferBase[o + 2] & 255) << 8, p = M & 65535, e._hash[1024 + p] = e._pos, d = (M ^ Ce[e._bufferBase[o + 3] & 255] << 5) & e._hashMask) : d = e._bufferBase[o] & 255 ^ (e._bufferBase[o + 1] & 255) << 8, _ = e._hash[e.kFixHashSize + d], e._hash[e.kFixHashSize + d] = e._pos, R = (e._cyclicBufferPos << 1) + 1, E = e._cyclicBufferPos << 1, w = S = e.kNumHashDirectBytes, n = e._cutValue;;) {
        if (_ <= L || n == 0) {
          n -= 1, e._son[R] = e._son[E] = 0;
          break
        }
        if (u = e._pos - _, f = (u <= e._cyclicBufferPos ? e._cyclicBufferPos - u : e._cyclicBufferPos - u + e._cyclicBufferSize) << 1, P = e._bufferOffset + _, l = w < S ? w : S, e._bufferBase[P + l] == e._bufferBase[o + l]) {
          for (;
            (l += 1) != k && e._bufferBase[P + l] == e._bufferBase[o + l];);
          if (l == k) {
            e._son[E] = e._son[f], e._son[R] = e._son[f + 1];
            break
          }
        }(e._bufferBase[P + l] & 255) < (e._bufferBase[o + l] & 255) ? (e._son[E] = _, E = f + 1, _ = e._son[E], S = l) : (e._son[R] = _, R = f, _ = e._son[R], w = l)
      }
      Ee(e)
    } while ((r -= 1) != 0)
  }
  function ir(e, r, n) {
    var o = e._pos - r - 1;
    for (o < 0 && (o += e._windowSize); n != 0; n -= 1) o >= e._windowSize && (o = 0), e._buffer[e._pos] = e._buffer[o], e._pos += 1, o += 1, e._pos >= e._windowSize && ge(e)
  }
  function sr(e, r) {
    (e._buffer == null || e._windowSize != r) && (e._buffer = v(r)), e._windowSize = r, e._pos = 0, e._streamPos = 0
  }
  function ge(e) {
    var r = e._pos - e._streamPos;
    !r || ($e(e._stream, e._buffer, e._streamPos, r), e._pos >= e._windowSize && (e._pos = 0), e._streamPos = e._pos)
  }
  function or(e, r) {
    var n = e._pos - r - 1;
    return n < 0 && (n += e._windowSize), e._buffer[n]
  }
  function tr(e, r) {
    e._buffer[e._pos] = r, e._pos += 1, e._pos >= e._windowSize && ge(e)
  }
  function _r(e) {
    ge(e), e._stream = null
  }
  function Le(e) {
    return e -= 2, e < 4 ? e : 3
  }
  function h(e) {
    return e < 4 ? 0 : e < 10 ? e - 3 : e - 6
  }
  function en(e, r) {
    return e.encoder = r, e.decoder = null, e.alive = 1, e
  }
  function rn(e, r) {
    return e.decoder = r, e.encoder = null, e.alive = 1, e
  }
  function fr(e) {
    if (!e.alive) throw new Error("bad state");
    if (e.encoder) throw new Error("No encoding");
    return nn(e), e.alive
  }
  function nn(e) {
    var r = fn(e.decoder);
    if (r == -1) throw new Error("corrupted input");
    e.inBytesProcessed = De, e.outBytesProcessed = e.decoder.nowPos64, (r || ne(e.decoder.outSize, H) >= 0 && ne(e.decoder.nowPos64, e.decoder.outSize) >= 0) && (ge(e.decoder.m_OutWindow), _r(e.decoder.m_OutWindow), e.decoder.m_RangeDecoder.Stream = null, e.alive = 0)
  }
  function ur(e) {
    if (!e.alive) throw new Error("bad state");
    if (e.encoder) on(e);
    else throw new Error("No decoding");
    return e.alive
  }
  function on(e) {
    bn(e.encoder, e.encoder.processedInSize, e.encoder.processedOutSize, e.encoder.finished), e.inBytesProcessed = e.encoder.processedInSize[0], e.encoder.finished[0] && (gn(e.encoder), e.alive = 0)
  }
  function _n(e, r, n, o) {
    return e.m_RangeDecoder.Stream = r, _r(e.m_OutWindow), e.m_OutWindow._stream = n, mn(e), e.state = 0, e.rep0 = 0, e.rep1 = 0, e.rep2 = 0, e.rep3 = 0, e.outSize = o, e.nowPos64 = H, e.prevByte = 0, rn({}, e)
  }
  function fn(e) {
    var r, n, o, _, f, u;
    if (u = O(e.nowPos64) & e.m_PosStateMask, !x(e.m_RangeDecoder, e.m_IsMatchDecoders, (e.state << 4) + u)) r = Bn(e.m_LiteralDecoder, O(e.nowPos64), e.prevByte), e.state < 7 ? e.prevByte = Sn(r, e.m_RangeDecoder) : e.prevByte = kn(r, e.m_RangeDecoder, or(e.m_OutWindow, e.rep0)), tr(e.m_OutWindow, e.prevByte), e.state = h(e.state), e.nowPos64 = K(e.nowPos64, Ye);
    else {
      if (x(e.m_RangeDecoder, e.m_IsRepDecoders, e.state)) o = 0, x(e.m_RangeDecoder, e.m_IsRepG0Decoders, e.state) ? (x(e.m_RangeDecoder, e.m_IsRepG1Decoders, e.state) ? (x(e.m_RangeDecoder, e.m_IsRepG2Decoders, e.state) ? (n = e.rep3, e.rep3 = e.rep2) : n = e.rep2, e.rep2 = e.rep1) : n = e.rep1, e.rep1 = e.rep0, e.rep0 = n) : x(e.m_RangeDecoder, e.m_IsRep0LongDecoders, (e.state << 4) + u) || (e.state = e.state < 7 ? 9 : 11, o = 1), o || (o = dr(e.m_RepLenDecoder, e.m_RangeDecoder, u) + 2, e.state = e.state < 7 ? 8 : 11);
      else if (e.rep3 = e.rep2, e.rep2 = e.rep1, e.rep1 = e.rep0, o = 2 + dr(e.m_LenDecoder, e.m_RangeDecoder, u), e.state = e.state < 7 ? 7 : 10, f = Ie(e.m_PosSlotDecoder[Le(o)], e.m_RangeDecoder), f >= 4) {
        if (_ = (f >> 1) - 1, e.rep0 = (2 | f & 1) << _, f < 14) e.rep0 += Vn(e.m_PosDecoders, e.rep0 - f - 1, e.m_RangeDecoder, _);
        else if (e.rep0 += Un(e.m_RangeDecoder, _ - 4) << 4, e.rep0 += Zn(e.m_PosAlignDecoder, e.m_RangeDecoder), e.rep0 < 0) return e.rep0 == -1 ? 1 : -1
      } else e.rep0 = f;
      if (ne(X(e.rep0), e.nowPos64) >= 0 || e.rep0 >= e.m_DictionarySizeCheck) return -1;
      ir(e.m_OutWindow, e.rep0, o), e.nowPos64 = K(e.nowPos64, X(o)), e.prevByte = or(e.m_OutWindow, 0)
    }
    return 0
  }
  function un(e) {
    e.m_OutWindow = {}, e.m_RangeDecoder = {}, e.m_IsMatchDecoders = v(192), e.m_IsRepDecoders = v(12), e.m_IsRepG0Decoders = v(12), e.m_IsRepG1Decoders = v(12), e.m_IsRepG2Decoders = v(12), e.m_IsRep0LongDecoders = v(192), e.m_PosSlotDecoder = v(4), e.m_PosDecoders = v(114), e.m_PosAlignDecoder = ve({}, 4), e.m_LenDecoder = pr({}), e.m_RepLenDecoder = pr({}), e.m_LiteralDecoder = {};
    for (var r = 0; r < 4; ++r) e.m_PosSlotDecoder[r] = ve({}, 6);
    return e
  }
  function mn(e) {
    e.m_OutWindow._streamPos = 0, e.m_OutWindow._pos = 0, y(e.m_IsMatchDecoders), y(e.m_IsRep0LongDecoders), y(e.m_IsRepDecoders), y(e.m_IsRepG0Decoders), y(e.m_IsRepG1Decoders), y(e.m_IsRepG2Decoders), y(e.m_PosDecoders), vn(e.m_LiteralDecoder);
    for (var r = 0; r < 4; ++r) y(e.m_PosSlotDecoder[r].Models);
    lr(e.m_LenDecoder), lr(e.m_RepLenDecoder), y(e.m_PosAlignDecoder.Models), qn(e.m_RangeDecoder)
  }
  function dn(e, r) {
    var n, o, _, f, u, m, p;
    if (r.length < 5) return 0;
    for (p = r[0] & 255, _ = p % 9, m = ~~(p / 9), f = m % 5, u = ~~(m / 5), n = 0, o = 0; o < 4; ++o) n += (r[1 + o] & 255) << o * 8;
    return n > 99999999 || !ln(e, _, f, u) ? 0 : pn(e, n)
  }
  function pn(e, r) {
    return r < 0 ? 0 : (e.m_DictionarySize != r && (e.m_DictionarySize = r, e.m_DictionarySizeCheck = Math.max(e.m_DictionarySize, 1), sr(e.m_OutWindow, Math.max(e.m_DictionarySizeCheck, 4096))), 1)
  }
  function ln(e, r, n, o) {
    if (r > 8 || n > 4 || o > 4) return 0;
    Pn(e.m_LiteralDecoder, n, r);
    var _ = 1 << o;
    return mr(e.m_LenDecoder, _), mr(e.m_RepLenDecoder, _), e.m_PosStateMask = _ - 1, 1
  }
  function mr(e, r) {
    for (; e.m_NumPosStates < r; e.m_NumPosStates += 1) e.m_LowCoder[e.m_NumPosStates] = ve({}, 3), e.m_MidCoder[e.m_NumPosStates] = ve({}, 3)
  }
  function dr(e, r, n) {
    if (!x(r, e.m_Choice, 0)) return Ie(e.m_LowCoder[n], r);
    var o = 8;
    return x(r, e.m_Choice, 1) ? o += 8 + Ie(e.m_HighCoder, r) : o += Ie(e.m_MidCoder[n], r), o
  }
  function pr(e) {
    return e.m_Choice = v(2), e.m_LowCoder = v(16), e.m_MidCoder = v(16), e.m_HighCoder = ve({}, 8), e.m_NumPosStates = 0, e
  }
  function lr(e) {
    y(e.m_Choice);
    for (var r = 0; r < e.m_NumPosStates; ++r) y(e.m_LowCoder[r].Models), y(e.m_MidCoder[r].Models);
    y(e.m_HighCoder.Models)
  }
  function Pn(e, r, n) {
    var o, _;
    if (!(e.m_Coders != null && e.m_NumPrevBits == n && e.m_NumPosBits == r))
      for (e.m_NumPosBits = r, e.m_PosMask = (1 << r) - 1, e.m_NumPrevBits = n, _ = 1 << e.m_NumPrevBits + e.m_NumPosBits, e.m_Coders = v(_), o = 0; o < _; ++o) e.m_Coders[o] = Rn({})
  }
  function Bn(e, r, n) {
    return e.m_Coders[((r & e.m_PosMask) << e.m_NumPrevBits) + ((n & 255) >>> 8 - e.m_NumPrevBits)]
  }
  function vn(e) {
    var r, n;
    for (n = 1 << e.m_NumPrevBits + e.m_NumPosBits, r = 0; r < n; ++r) y(e.m_Coders[r].m_Decoders)
  }
  function Sn(e, r) {
    var n = 1;
    do n = n << 1 | x(r, e.m_Decoders, n); while (n < 256);
    return n << 24 >> 24
  }
  function kn(e, r, n) {
    var o, _, f = 1;
    do
      if (_ = n >> 7 & 1, n <<= 1, o = x(r, e.m_Decoders, (1 + _ << 8) + f), f = f << 1 | o, _ != o) {
        for (; f < 256;) f = f << 1 | x(r, e.m_Decoders, f);
        break
      } while (f < 256);
    return f << 24 >> 24
  }
  function Rn(e) {
    return e.m_Decoders = v(768), e
  }
  var fe = function () {
    var e, r, n, o = 2,
      _ = [0, 1];
    for (n = 2; n < 22; ++n) {
      var f = n;
      for (f >>= 1, f -= 1, r = 1, r <<= f, e = 0; e < r; ++e, ++o) _[o] = n << 24 >> 24
    }
    return _
  }();
  function Pr(e, r) {
    var n, o, _, f;
    e._optimumEndIndex = r, _ = e._optimum[r].PosPrev, o = e._optimum[r].BackPrev;
    do e._optimum[r].Prev1IsChar && (Cr(e._optimum[_]), e._optimum[_].PosPrev = _ - 1, e._optimum[r].Prev2 && (e._optimum[_ - 1].Prev1IsChar = 0, e._optimum[_ - 1].PosPrev = e._optimum[r].PosPrev2, e._optimum[_ - 1].BackPrev = e._optimum[r].BackPrev2)), f = _, n = o, o = e._optimum[f].BackPrev, _ = e._optimum[f].PosPrev, e._optimum[f].BackPrev = n, e._optimum[f].PosPrev = r, r = f; while (r > 0);
    return e.backRes = e._optimum[0].BackPrev, e._optimumCurrentIndex = e._optimum[0].PosPrev, e._optimumCurrentIndex
  }
  function Mn(e) {
    e._state = 0, e._previousByte = 0;
    for (var r = 0; r < 4; ++r) e._repDistances[r] = 0
  }
  function bn(e, r, n, o) {
    var _, f, u, m, p, d, l, w, S, k, L, P, R, E, M;
    if (r[0] = H, n[0] = H, o[0] = 1, e._inStream && (e._matchFinder._stream = e._inStream, ar(e._matchFinder), e._needReleaseMFStream = 1, e._inStream = null), !e._finished) {
      if (e._finished = 1, E = e.nowPos64, qe(e.nowPos64, H)) {
        if (!Be(e._matchFinder)) {
          Te(e, O(e.nowPos64));
          return
        }
        We(e), R = O(e.nowPos64) & e._posStateMask, C(e._rangeEncoder, e._isMatch, (e._state << 4) + R, 0), e._state = h(e._state), u = G(e._matchFinder, -e._additionalOffset), yr(me(e._literalEncoder, O(e.nowPos64), e._previousByte), e._rangeEncoder, u), e._previousByte = u, e._additionalOffset -= 1, e.nowPos64 = K(e.nowPos64, Ye)
      }
      if (!Be(e._matchFinder)) {
        Te(e, O(e.nowPos64));
        return
      }
      for (;;) {
        if (l = yn(e, O(e.nowPos64)), k = e.backRes, R = O(e.nowPos64) & e._posStateMask, f = (e._state << 4) + R, l == 1 && k == -1) C(e._rangeEncoder, e._isMatch, f, 0), u = G(e._matchFinder, -e._additionalOffset), M = me(e._literalEncoder, O(e.nowPos64), e._previousByte), e._state < 7 ? yr(M, e._rangeEncoder, u) : (S = G(e._matchFinder, -e._repDistances[0] - 1 - e._additionalOffset), Tn(M, e._rangeEncoder, S, u)), e._previousByte = u, e._state = h(e._state);
        else {
          if (C(e._rangeEncoder, e._isMatch, f, 1), k < 4) {
            if (C(e._rangeEncoder, e._isRep, e._state, 1), k ? (C(e._rangeEncoder, e._isRepG0, e._state, 1), k == 1 ? C(e._rangeEncoder, e._isRepG1, e._state, 0) : (C(e._rangeEncoder, e._isRepG1, e._state, 1), C(e._rangeEncoder, e._isRepG2, e._state, k - 2))) : (C(e._rangeEncoder, e._isRepG0, e._state, 0), l == 1 ? C(e._rangeEncoder, e._isRep0Long, f, 0) : C(e._rangeEncoder, e._isRep0Long, f, 1)), l == 1 ? e._state = e._state < 7 ? 9 : 11 : (Ze(e._repMatchLenEncoder, e._rangeEncoder, l - 2, R), e._state = e._state < 7 ? 8 : 11), m = e._repDistances[k], k != 0) {
              for (var d = k; d >= 1; --d) e._repDistances[d] = e._repDistances[d - 1];
              e._repDistances[0] = m
            }
          } else {
            C(e._rangeEncoder, e._isRep, e._state, 0), e._state = e._state < 7 ? 7 : 10, Ze(e._lenEncoder, e._rangeEncoder, l - 2, R), k -= 4, P = He(k), w = Le(l), ke(e._posSlotEncoder[w], e._rangeEncoder, P), P >= 4 && (p = (P >> 1) - 1, _ = (2 | P & 1) << p, L = k - _, P < 14 ? Yn(e._posEncoders, _ - P - 1, e._rangeEncoder, p, L) : (gr(e._rangeEncoder, L >> 4, p - 4), Er(e._posAlignEncoder, e._rangeEncoder, L & 15), e._alignPriceCount += 1)), m = k;
            for (var d = 3; d >= 1; --d) e._repDistances[d] = e._repDistances[d - 1];
            e._repDistances[0] = m, e._matchPriceCount += 1
          }
          e._previousByte = G(e._matchFinder, l - 1 - e._additionalOffset)
        }
        if (e._additionalOffset -= l, e.nowPos64 = K(e.nowPos64, X(l)), !e._additionalOffset) {
          if (e._matchPriceCount >= 128 && vr(e), e._alignPriceCount >= 16 && Br(e), r[0] = e.nowPos64, n[0] = Jn(e._rangeEncoder), !Be(e._matchFinder)) {
            Te(e, O(e.nowPos64));
            return
          }
          if (ne(Xe(e.nowPos64, E), [4096, 0]) >= 0) {
            e._finished = 0, o[0] = 0;
            return
          }
        }
      }
    }
  }
  function Dn(e) {
    var r, n;
    e._matchFinder || (r = {}, n = 4, e._matchFinderType || (n = 2), hr(r, n), e._matchFinder = r), Gn(e._literalEncoder, e._numLiteralPosStateBits, e._numLiteralContextBits), !(e._dictionarySize == e._dictionarySizePrev && e._numFastBytesPrev == e._numFastBytes) && (Xr(e._matchFinder, e._dictionarySize, 4096, e._numFastBytes, 274), e._dictionarySizePrev = e._dictionarySize, e._numFastBytesPrev = e._numFastBytes)
  }
  function wn(e) {
    var r;
    for (e._repDistances = v(4), e._optimum = [], e._rangeEncoder = {}, e._isMatch = v(192), e._isRep = v(12), e._isRepG0 = v(12), e._isRepG1 = v(12), e._isRepG2 = v(12), e._isRep0Long = v(192), e._posSlotEncoder = [], e._posEncoders = v(114), e._posAlignEncoder = Se({}, 4), e._lenEncoder = Dr({}), e._repMatchLenEncoder = Dr({}), e._literalEncoder = {}, e._matchDistances = [], e._posSlotPrices = [], e._distancesPrices = [], e._alignPrices = v(16), e.reps = v(4), e.repLens = v(4), e.processedInSize = [H], e.processedOutSize = [H], e.finished = [0], e.properties = v(5), e.tempPrices = v(128), e._longestMatchLength = 0, e._matchFinderType = 1, e._numDistancePairs = 0, e._numFastBytesPrev = -1, e.backRes = 0, r = 0; r < 4096; ++r) e._optimum[r] = {};
    for (r = 0; r < 4; ++r) e._posSlotEncoder[r] = Se({}, 6);
    return e
  }
  function Br(e) {
    for (var r = 0; r < 16; ++r) e._alignPrices[r] = jn(e._posAlignEncoder, r);
    e._alignPriceCount = 0
  }
  function vr(e) {
    var r, n, o, _, f, u, m, p;
    for (_ = 4; _ < 128; ++_) u = He(_), o = (u >> 1) - 1, r = (2 | u & 1) << o, e.tempPrices[_] = Kn(e._posEncoders, r - u - 1, o, _ - r);
    for (f = 0; f < 4; ++f) {
      for (n = e._posSlotEncoder[f], m = f << 6, u = 0; u < e._distTableSize; u += 1) e._posSlotPrices[m + u] = ze(n, u);
      for (u = 14; u < e._distTableSize; u += 1) e._posSlotPrices[m + u] += (u >> 1) - 1 - 4 << 6;
      for (p = f * 128, _ = 0; _ < 4; ++_) e._distancesPrices[p + _] = e._posSlotPrices[m + _];
      for (; _ < 128; ++_) e._distancesPrices[p + _] = e._posSlotPrices[m + He(_)] + e.tempPrices[_]
    }
    e._matchPriceCount = 0
  }
  function Te(e, r) {
    Rr(e), zn(e, r & e._posStateMask);
    for (var n = 0; n < 5; ++n) Ve(e._rangeEncoder)
  }
  function yn(e, r) {
    var n, o, _, f, u, m, p, d, l, w, S, k, L, P, R, E, M, Z, z, V, U, W, pe, Ge, j, q, J, T, c, g, B, $, s, A, N, zr, Y, Me, t, a, le, be, b, F, Pe, Ar, Nr, Or, Gr, xr;
    if (e._optimumEndIndex != e._optimumCurrentIndex) return L = e._optimum[e._optimumCurrentIndex].PosPrev - e._optimumCurrentIndex, e.backRes = e._optimum[e._optimumCurrentIndex].BackPrev, e._optimumCurrentIndex = e._optimum[e._optimumCurrentIndex].PosPrev, L;
    if (e._optimumCurrentIndex = e._optimumEndIndex = 0, e._longestMatchWasFound ? (k = e._longestMatchLength, e._longestMatchWasFound = 0) : k = We(e), J = e._numDistancePairs, j = Be(e._matchFinder) + 1, j < 2) return e.backRes = -1, 1;
    for (j > 273 && (j = 273), a = 0, l = 0; l < 4; ++l) e.reps[l] = e._repDistances[l], e.repLens[l] = _e(e._matchFinder, -1, e.reps[l], 273), e.repLens[l] > e.repLens[a] && (a = l);
    if (e.repLens[a] >= e._numFastBytes) return e.backRes = a, L = e.repLens[a], kr(e, L - 1), L;
    if (k >= e._numFastBytes) return e.backRes = e._matchDistances[J - 1] + 4, kr(e, k - 1), k;
    if (p = G(e._matchFinder, -1), M = G(e._matchFinder, -e._repDistances[0] - 1 - 1), k < 2 && p != M && e.repLens[a] < 2) return e.backRes = -1, 1;
    if (e._optimum[0].State = e._state, A = r & e._posStateMask, e._optimum[1].Price = D[e._isMatch[(e._state << 4) + A] >>> 2] + Fe(me(e._literalEncoder, r, e._previousByte), e._state >= 7, M, p), Cr(e._optimum[1]), Z = D[2048 - e._isMatch[(e._state << 4) + A] >>> 2], t = Z + D[2048 - e._isRep[e._state] >>> 2], M == p && (le = t + Cn(e, e._state, A), le < e._optimum[1].Price && (e._optimum[1].Price = le, Hn(e._optimum[1]))), S = k >= e.repLens[a] ? k : e.repLens[a], S < 2) return e.backRes = e._optimum[1].BackPrev, 1;
    e._optimum[1].PosPrev = 0, e._optimum[0].Backs0 = e.reps[0], e._optimum[0].Backs1 = e.reps[1], e._optimum[0].Backs2 = e.reps[2], e._optimum[0].Backs3 = e.reps[3], w = S;
    do e._optimum[w].Price = 268435455, w -= 1; while (w >= 2);
    for (l = 0; l < 4; ++l)
      if (Me = e.repLens[l], !(Me < 2)) {
        zr = t + ue(e, l, e._state, A);
        do f = zr + i(e._repMatchLenEncoder, Me - 2, A), B = e._optimum[Me], f < B.Price && (B.Price = f, B.PosPrev = 0, B.BackPrev = l, B.Prev1IsChar = 0); while ((Me -= 1) >= 2)
      } if (Ge = Z + D[e._isRep[e._state] >>> 2], w = e.repLens[0] >= 2 ? e.repLens[0] + 1 : 2, w <= k) {
      for (T = 0; w > e._matchDistances[T];) T += 2;
      for (; d = e._matchDistances[T + 1], f = Ge + Sr(e, d, w, A), B = e._optimum[w], f < B.Price && (B.Price = f, B.PosPrev = 0, B.BackPrev = d + 4, B.Prev1IsChar = 0), !(w == e._matchDistances[T] && (T += 2, T == J)); w += 1);
    }
    for (n = 0;;) {
      if (++n, n == S) return Pr(e, n);
      if (z = We(e), J = e._numDistancePairs, z >= e._numFastBytes) return e._longestMatchLength = z, e._longestMatchWasFound = 1, Pr(e, n);
      if (r += 1, s = e._optimum[n].PosPrev, e._optimum[n].Prev1IsChar ? (s -= 1, e._optimum[n].Prev2 ? (b = e._optimum[e._optimum[n].PosPrev2].State, e._optimum[n].BackPrev2 < 4 ? b = b < 7 ? 8 : 11 : b = b < 7 ? 7 : 10) : b = e._optimum[s].State, b = h(b)) : b = e._optimum[s].State, s == n - 1 ? e._optimum[n].BackPrev ? b = h(b) : b = b < 7 ? 9 : 11 : (e._optimum[n].Prev1IsChar && e._optimum[n].Prev2 ? (s = e._optimum[n].PosPrev2, $ = e._optimum[n].BackPrev2, b = b < 7 ? 8 : 11) : ($ = e._optimum[n].BackPrev, $ < 4 ? b = b < 7 ? 8 : 11 : b = b < 7 ? 7 : 10), g = e._optimum[s], $ < 4 ? $ ? $ == 1 ? (e.reps[0] = g.Backs1, e.reps[1] = g.Backs0, e.reps[2] = g.Backs2, e.reps[3] = g.Backs3) : $ == 2 ? (e.reps[0] = g.Backs2, e.reps[1] = g.Backs0, e.reps[2] = g.Backs1, e.reps[3] = g.Backs3) : (e.reps[0] = g.Backs3, e.reps[1] = g.Backs0, e.reps[2] = g.Backs1, e.reps[3] = g.Backs2) : (e.reps[0] = g.Backs0, e.reps[1] = g.Backs1, e.reps[2] = g.Backs2, e.reps[3] = g.Backs3) : (e.reps[0] = $ - 4, e.reps[1] = g.Backs0, e.reps[2] = g.Backs1, e.reps[3] = g.Backs2)), e._optimum[n].State = b, e._optimum[n].Backs0 = e.reps[0], e._optimum[n].Backs1 = e.reps[1], e._optimum[n].Backs2 = e.reps[2], e._optimum[n].Backs3 = e.reps[3], m = e._optimum[n].Price, p = G(e._matchFinder, -1), M = G(e._matchFinder, -e.reps[0] - 1 - 1), A = r & e._posStateMask, o = m + D[e._isMatch[(b << 4) + A] >>> 2] + Fe(me(e._literalEncoder, r, G(e._matchFinder, -2)), b >= 7, M, p), W = e._optimum[n + 1], V = 0, o < W.Price && (W.Price = o, W.PosPrev = n, W.BackPrev = -1, W.Prev1IsChar = 0, V = 1), Z = m + D[2048 - e._isMatch[(b << 4) + A] >>> 2], t = Z + D[2048 - e._isRep[b] >>> 2], M == p && !(W.PosPrev < n && !W.BackPrev) && (le = t + (D[e._isRepG0[b] >>> 2] + D[e._isRep0Long[(b << 4) + A] >>> 2]), le <= W.Price && (W.Price = le, W.PosPrev = n, W.BackPrev = 0, W.Prev1IsChar = 0, V = 1)), q = Be(e._matchFinder) + 1, q = 4095 - n < q ? 4095 - n : q, j = q, !(j < 2)) {
        if (j > e._numFastBytes && (j = e._numFastBytes), !V && M != p && (Pe = Math.min(q - 1, e._numFastBytes), R = _e(e._matchFinder, 0, e.reps[0], Pe), R >= 2)) {
          for (F = h(b), N = r + 1 & e._posStateMask, pe = o + D[2048 - e._isMatch[(F << 4) + N] >>> 2] + D[2048 - e._isRep[F] >>> 2], c = n + 1 + R; S < c;) e._optimum[S += 1].Price = 268435455;
          f = pe + (Ar = i(e._repMatchLenEncoder, R - 2, N), Ar + ue(e, 0, F, N)), B = e._optimum[c], f < B.Price && (B.Price = f, B.PosPrev = n + 1, B.BackPrev = 0, B.Prev1IsChar = 1, B.Prev2 = 0)
        }
        for (be = 2, Y = 0; Y < 4; ++Y)
          if (P = _e(e._matchFinder, -1, e.reps[Y], j), !(P < 2)) {
            E = P;
            do {
              for (; S < n + P;) e._optimum[S += 1].Price = 268435455;
              f = t + (Nr = i(e._repMatchLenEncoder, P - 2, A), Nr + ue(e, Y, b, A)), B = e._optimum[n + P], f < B.Price && (B.Price = f, B.PosPrev = n, B.BackPrev = Y, B.Prev1IsChar = 0)
            } while ((P -= 1) >= 2);
            if (P = E, Y || (be = P + 1), P < q && (Pe = Math.min(q - 1 - P, e._numFastBytes), R = _e(e._matchFinder, P, e.reps[Y], Pe), R >= 2)) {
              for (F = b < 7 ? 8 : 11, N = r + P & e._posStateMask, _ = t + (Or = i(e._repMatchLenEncoder, P - 2, A), Or + ue(e, Y, b, A)) + D[e._isMatch[(F << 4) + N] >>> 2] + Fe(me(e._literalEncoder, r + P, G(e._matchFinder, P - 1 - 1)), 1, G(e._matchFinder, P - 1 - (e.reps[Y] + 1)), G(e._matchFinder, P - 1)), F = h(F), N = r + P + 1 & e._posStateMask, U = _ + D[2048 - e._isMatch[(F << 4) + N] >>> 2], pe = U + D[2048 - e._isRep[F] >>> 2], c = P + 1 + R; S < n + c;) e._optimum[S += 1].Price = 268435455;
              f = pe + (Gr = i(e._repMatchLenEncoder, R - 2, N), Gr + ue(e, 0, F, N)), B = e._optimum[n + c], f < B.Price && (B.Price = f, B.PosPrev = n + P + 1, B.BackPrev = 0, B.Prev1IsChar = 1, B.Prev2 = 1, B.PosPrev2 = n, B.BackPrev2 = Y)
            }
          } if (z > j) {
          for (z = j, J = 0; z > e._matchDistances[J]; J += 2);
          e._matchDistances[J] = z, J += 2
        }
        if (z >= be) {
          for (Ge = Z + D[e._isRep[b] >>> 2]; S < n + z;) e._optimum[S += 1].Price = 268435455;
          for (T = 0; be > e._matchDistances[T];) T += 2;
          for (P = be;; P += 1)
            if (u = e._matchDistances[T + 1], f = Ge + Sr(e, u, P, A), B = e._optimum[n + P], f < B.Price && (B.Price = f, B.PosPrev = n, B.BackPrev = u + 4, B.Prev1IsChar = 0), P == e._matchDistances[T]) {
              if (P < q && (Pe = Math.min(q - 1 - P, e._numFastBytes), R = _e(e._matchFinder, P, u, Pe), R >= 2)) {
                for (F = b < 7 ? 7 : 10, N = r + P & e._posStateMask, _ = f + D[e._isMatch[(F << 4) + N] >>> 2] + Fe(me(e._literalEncoder, r + P, G(e._matchFinder, P - 1 - 1)), 1, G(e._matchFinder, P - (u + 1) - 1), G(e._matchFinder, P - 1)), F = h(F), N = r + P + 1 & e._posStateMask, U = _ + D[2048 - e._isMatch[(F << 4) + N] >>> 2], pe = U + D[2048 - e._isRep[F] >>> 2], c = P + 1 + R; S < n + c;) e._optimum[S += 1].Price = 268435455;
                f = pe + (xr = i(e._repMatchLenEncoder, R - 2, N), xr + ue(e, 0, F, N)), B = e._optimum[n + c], f < B.Price && (B.Price = f, B.PosPrev = n + P + 1, B.BackPrev = 0, B.Prev1IsChar = 1, B.Prev2 = 1, B.PosPrev2 = n, B.BackPrev2 = u + 4)
              }
              if (T += 2, T == J) break
            }
        }
      }
    }
  }
  function Sr(e, r, n, o) {
    var _, f = Le(n);
    return r < 128 ? _ = e._distancesPrices[f * 128 + r] : _ = e._posSlotPrices[(f << 6) + An(r)] + e._alignPrices[r & 15], _ + i(e._lenEncoder, n - 2, o)
  }
  function ue(e, r, n, o) {
    var _;
    return r ? (_ = D[2048 - e._isRepG0[n] >>> 2], r == 1 ? _ += D[e._isRepG1[n] >>> 2] : (_ += D[2048 - e._isRepG1[n] >>> 2], _ += Re(e._isRepG2[n], r - 2))) : (_ = D[e._isRepG0[n] >>> 2], _ += D[2048 - e._isRep0Long[(n << 4) + o] >>> 2]), _
  }
  function Cn(e, r, n) {
    return D[e._isRepG0[r] >>> 2] + D[e._isRep0Long[(r << 4) + n] >>> 2]
  }
  function En(e) {
    Mn(e), Qn(e._rangeEncoder), y(e._isMatch), y(e._isRep0Long), y(e._isRep), y(e._isRepG0), y(e._isRepG1), y(e._isRepG2), y(e._posEncoders), xn(e._literalEncoder);
    for (var r = 0; r < 4; ++r) y(e._posSlotEncoder[r].Models);
    Mr(e._lenEncoder, 1 << e._posStateBits), Mr(e._repMatchLenEncoder, 1 << e._posStateBits), y(e._posAlignEncoder.Models), e._longestMatchWasFound = 0, e._optimumEndIndex = 0, e._optimumCurrentIndex = 0, e._additionalOffset = 0
  }
  function kr(e, r) {
    r > 0 && ($r(e._matchFinder, r), e._additionalOffset += r)
  }
  function We(e) {
    var r = 0;
    return e._numDistancePairs = cr(e._matchFinder, e._matchDistances), e._numDistancePairs > 0 && (r = e._matchDistances[e._numDistancePairs - 2], r == e._numFastBytes && (r += _e(e._matchFinder, r - 1, e._matchDistances[e._numDistancePairs - 1], 273 - r))), e._additionalOffset += 1, r
  }
  function Rr(e) {
    e._matchFinder && e._needReleaseMFStream && (e._matchFinder._stream = null, e._needReleaseMFStream = 0)
  }
  function gn(e) {
    Rr(e), e._rangeEncoder.Stream = null
  }
  function Ln(e, r) {
    e._dictionarySize = r;
    for (var n = 0; r > 1 << n; ++n);
    e._distTableSize = n * 2
  }
  function Fn(e, r) {
    var n = e._matchFinderType;
    e._matchFinderType = r, e._matchFinder && n != e._matchFinderType && (e._dictionarySizePrev = -1, e._matchFinder = null)
  }
  function In(e, r) {
    e.properties[0] = (e._posStateBits * 5 + e._numLiteralPosStateBits) * 9 + e._numLiteralContextBits << 24 >> 24;
    for (var n = 0; n < 4; ++n) e.properties[1 + n] = e._dictionarySize >> 8 * n << 24 >> 24;
    $e(r, e.properties, 0, 5)
  }
  function zn(e, r) {
    C(e._rangeEncoder, e._isMatch, (e._state << 4) + r, 1), C(e._rangeEncoder, e._isRep, e._state, 0), e._state = e._state < 7 ? 7 : 10, Ze(e._lenEncoder, e._rangeEncoder, 0, r);
    var n = Le(2);
    ke(e._posSlotEncoder[n], e._rangeEncoder, 63), gr(e._rangeEncoder, 67108863, 26), Er(e._posAlignEncoder, e._rangeEncoder, 15)
  }
  function He(e) {
    return e < 2048 ? fe[e] : e < 2097152 ? fe[e >> 10] + 20 : fe[e >> 20] + 40
  }
  function An(e) {
    return e < 131072 ? fe[e >> 6] + 12 : e < 134217728 ? fe[e >> 16] + 32 : fe[e >> 26] + 52
  }
  function Nn(e, r, n, o) {
    n < 8 ? (C(r, e._choice, 0, 0), ke(e._lowCoder[o], r, n)) : (n -= 8, C(r, e._choice, 0, 1), n < 8 ? (C(r, e._choice, 1, 0), ke(e._midCoder[o], r, n)) : (C(r, e._choice, 1, 1), ke(e._highCoder, r, n - 8)))
  }
  function On(e) {
    e._choice = v(2), e._lowCoder = v(16), e._midCoder = v(16), e._highCoder = Se({}, 8);
    for (var r = 0; r < 16; ++r) e._lowCoder[r] = Se({}, 3), e._midCoder[r] = Se({}, 3);
    return e
  }
  function Mr(e, r) {
    y(e._choice);
    for (var n = 0; n < r; ++n) y(e._lowCoder[n].Models), y(e._midCoder[n].Models);
    y(e._highCoder.Models)
  }
  function br(e, r, n, o, _) {
    var f, u, m, p, d;
    for (f = D[e._choice[0] >>> 2], u = D[2048 - e._choice[0] >>> 2], m = u + D[e._choice[1] >>> 2], p = u + D[2048 - e._choice[1] >>> 2], d = 0, d = 0; d < 8; ++d) {
      if (d >= n) return;
      o[_ + d] = f + ze(e._lowCoder[r], d)
    }
    for (; d < 16; ++d) {
      if (d >= n) return;
      o[_ + d] = m + ze(e._midCoder[r], d - 8)
    }
    for (; d < n; ++d) o[_ + d] = p + ze(e._highCoder, d - 8 - 8)
  }
  function Ze(e, r, n, o) {
    Nn(e, r, n, o), (e._counters[o] -= 1) == 0 && (br(e, o, e._tableSize, e._prices, o * 272), e._counters[o] = e._tableSize)
  }
  function Dr(e) {
    return On(e), e._prices = [], e._counters = [], e
  }
  function i(e, r, n) {
    return e._prices[n * 272 + r]
  }
  function wr(e, r) {
    for (var n = 0; n < r; ++n) br(e, n, e._tableSize, e._prices, n * 272), e._counters[n] = e._tableSize
  }
  function Gn(e, r, n) {
    var o, _;
    if (!(e.m_Coders != null && e.m_NumPrevBits == n && e.m_NumPosBits == r))
      for (e.m_NumPosBits = r, e.m_PosMask = (1 << r) - 1, e.m_NumPrevBits = n, _ = 1 << e.m_NumPrevBits + e.m_NumPosBits, e.m_Coders = v(_), o = 0; o < _; ++o) e.m_Coders[o] = Wn({})
  }
  function me(e, r, n) {
    return e.m_Coders[((r & e.m_PosMask) << e.m_NumPrevBits) + ((n & 255) >>> 8 - e.m_NumPrevBits)]
  }
  function xn(e) {
    var r, n = 1 << e.m_NumPrevBits + e.m_NumPosBits;
    for (r = 0; r < n; ++r) y(e.m_Coders[r].m_Encoders)
  }
  function yr(e, r, n) {
    var o, _, f = 1;
    for (_ = 7; _ >= 0; --_) o = n >> _ & 1, C(r, e.m_Encoders, f, o), f = f << 1 | o
  }
  function Tn(e, r, n, o) {
    var _, f, u, m, p = 1,
      d = 1;
    for (f = 7; f >= 0; --f) _ = o >> f & 1, m = d, p && (u = n >> f & 1, m += 1 + u << 8, p = u == _), C(r, e.m_Encoders, m, _), d = d << 1 | _
  }
  function Wn(e) {
    return e.m_Encoders = v(768), e
  }
  function Fe(e, r, n, o) {
    var _, f = 1,
      u = 7,
      m, p = 0;
    if (r) {
      for (; u >= 0; --u)
        if (m = n >> u & 1, _ = o >> u & 1, p += Re(e.m_Encoders[(1 + m << 8) + f], _), f = f << 1 | _, m != _) {
          --u;
          break
        }
    }
    for (; u >= 0; --u) _ = o >> u & 1, p += Re(e.m_Encoders[f], _), f = f << 1 | _;
    return p
  }
  function Cr(e) {
    e.BackPrev = -1, e.Prev1IsChar = 0
  }
  function Hn(e) {
    e.BackPrev = 0, e.Prev1IsChar = 0
  }
  function ve(e, r) {
    return e.NumBitLevels = r, e.Models = v(1 << r), e
  }
  function Ie(e, r) {
    var n, o = 1;
    for (n = e.NumBitLevels; n != 0; n -= 1) o = (o << 1) + x(r, e.Models, o);
    return o - (1 << e.NumBitLevels)
  }
  function Zn(e, r) {
    var n, o, _ = 1,
      f = 0;
    for (o = 0; o < e.NumBitLevels; ++o) n = x(r, e.Models, _), _ <<= 1, _ += n, f |= n << o;
    return f
  }
  function Vn(e, r, n, o) {
    var _, f, u = 1,
      m = 0;
    for (f = 0; f < o; ++f) _ = x(n, e, r + u), u <<= 1, u += _, m |= _ << f;
    return m
  }
  function Se(e, r) {
    return e.NumBitLevels = r, e.Models = v(1 << r), e
  }
  function ke(e, r, n) {
    var o, _, f = 1;
    for (_ = e.NumBitLevels; _ != 0;) _ -= 1, o = n >>> _ & 1, C(r, e.Models, f, o), f = f << 1 | o
  }
  function ze(e, r) {
    var n, o, _ = 1,
      f = 0;
    for (o = e.NumBitLevels; o != 0;) o -= 1, n = r >>> o & 1, f += Re(e.Models[_], n), _ = (_ << 1) + n;
    return f
  }
  function Er(e, r, n) {
    var o, _, f = 1;
    for (_ = 0; _ < e.NumBitLevels; ++_) o = n & 1, C(r, e.Models, f, o), f = f << 1 | o, n >>= 1
  }
  function jn(e, r) {
    var n, o, _ = 1,
      f = 0;
    for (o = e.NumBitLevels; o != 0; o -= 1) n = r & 1, r >>>= 1, f += Re(e.Models[_], n), _ = _ << 1 | n;
    return f
  }
  function Yn(e, r, n, o, _) {
    var f, u, m = 1;
    for (u = 0; u < o; ++u) f = _ & 1, C(n, e, r + m, f), m = m << 1 | f, _ >>= 1
  }
  function Kn(e, r, n, o) {
    var _, f, u = 1,
      m = 0;
    for (f = n; f != 0; f -= 1) _ = o & 1, o >>>= 1, m += D[((e[r + u] - _ ^ -_) & 2047) >>> 2], u = u << 1 | _;
    return m
  }
  function x(e, r, n) {
    var o, _ = r[n];
    return o = (e.Range >>> 11) * _, (e.Code ^ -2147483648) < (o ^ -2147483648) ? (e.Range = o, r[n] = _ + (2048 - _ >>> 5) << 16 >> 16, e.Range & -16777216 || (e.Code = e.Code << 8 | oe(e.Stream), e.Range <<= 8), 0) : (e.Range -= o, e.Code -= o, r[n] = _ - (_ >>> 5) << 16 >> 16, e.Range & -16777216 || (e.Code = e.Code << 8 | oe(e.Stream), e.Range <<= 8), 1)
  }
  function Un(e, r) {
    var n, o, _ = 0;
    for (n = r; n != 0; n -= 1) e.Range >>>= 1, o = e.Code - e.Range >>> 31, e.Code -= e.Range & o - 1, _ = _ << 1 | 1 - o, e.Range & -16777216 || (e.Code = e.Code << 8 | oe(e.Stream), e.Range <<= 8);
    return _
  }
  function qn(e) {
    e.Code = 0, e.Range = -1;
    for (var r = 0; r < 5; ++r) e.Code = e.Code << 8 | oe(e.Stream)
  }
  function y(e) {
    for (var r = e.length - 1; r >= 0; --r) e[r] = 1024
  }
  var D = function () {
    var e, r, n, o, _ = [];
    for (r = 8; r >= 0; --r)
      for (o = 1, o <<= 9 - r - 1, e = 1, e <<= 9 - r, n = o; n < e; ++n) _[n] = (r << 6) + (e - n << 6 >>> 9 - r - 1);
    return _
  }();
  function C(e, r, n, o) {
    var _, f = r[n];
    _ = (e.Range >>> 11) * f, o ? (e.Low = K(e.Low, Ue(X(_), [4294967295, 0])), e.Range -= _, r[n] = f - (f >>> 5) << 16 >> 16) : (e.Range = _, r[n] = f + (2048 - f >>> 5) << 16 >> 16), e.Range & -16777216 || (e.Range <<= 8, Ve(e))
  }
  function gr(e, r, n) {
    for (var o = n - 1; o >= 0; o -= 1) e.Range >>>= 1, (r >>> o & 1) == 1 && (e.Low = K(e.Low, X(e.Range))), e.Range & -16777216 || (e.Range <<= 8, Ve(e))
  }
  function Jn(e) {
    return K(K(X(e._cacheSize), e._position), [4, 0])
  }
  function Qn(e) {
    e._position = H, e.Low = H, e.Range = -1, e._cacheSize = 1, e._cache = 0
  }
  function Ve(e) {
    var r, n = O(Zr(e.Low, 32));
    if (n != 0 || ne(e.Low, [4278190080, 0]) < 0) {
      e._position = K(e._position, X(e._cacheSize)), r = e._cache;
      do he(e.Stream, r + n), r = 255; while ((e._cacheSize -= 1) != 0);
      e._cache = O(e.Low) >>> 24
    }
    e._cacheSize += 1, e.Low = Je(Ue(e.Low, [16777215, 0]), 8)
  }
  function Re(e, r) {
    return D[((e - r ^ -r) & 2047) >>> 2]
  }
  function Lr(e) {
    for (var r = 0, n = 0, o, _, f, u = e.length, m = [], p = []; r < u; ++r, ++n) {
      if (o = e[r] & 255, o & 128)
        if ((o & 224) == 192) {
          if (r + 1 >= u || (_ = e[++r] & 255, (_ & 192) != 128)) return e;
          p[n] = (o & 31) << 6 | _ & 63
        } else if ((o & 240) == 224) {
        if (r + 2 >= u || (_ = e[++r] & 255, (_ & 192) != 128) || (f = e[++r] & 255, (f & 192) != 128)) return e;
        p[n] = (o & 15) << 12 | (_ & 63) << 6 | f & 63
      } else return e;
      else {
        if (!o) return e;
        p[n] = o
      }
      n == 16383 && (m.push(String.fromCharCode.apply(String, p)), n = -1)
    }
    return n > 0 && (p.length = n, m.push(String.fromCharCode.apply(String, p))), m.join("")
  }
  function Fr(e) {
    var r, n = [],
      o, _ = 0,
      f, u = e.length;
    if (typeof e == "object") return e;
    for (jr(e, 0, u, n, 0), f = 0; f < u; ++f) r = n[f], r >= 1 && r <= 127 ? ++_ : !r || r >= 128 && r <= 2047 ? _ += 2 : _ += 3;
    for (o = [], _ = 0, f = 0; f < u; ++f) r = n[f], r >= 1 && r <= 127 ? o[_++] = r << 24 >> 24 : !r || r >= 128 && r <= 2047 ? (o[_++] = (192 | r >> 6 & 31) << 24 >> 24, o[_++] = (128 | r & 63) << 24 >> 24) : (o[_++] = (224 | r >> 12 & 15) << 24 >> 24, o[_++] = (128 | r >> 6 & 63) << 24 >> 24, o[_++] = (128 | r & 63) << 24 >> 24);
    return o
  }
  function Ae(e) {
    return e[1] + e[0]
  }
  function Ne(e, r, n, o) {
    var _ = {},
      f, u, m = typeof n == "undefined" && typeof o == "undefined";
    if (typeof n != "function" && (u = n, n = o = 0), o = o || function (d) {
        if (typeof u != "undefined") return Ke(d, u)
      }, n = n || function (d, l) {
        if (typeof u != "undefined") return postMessage({
          action: ee,
          cbn: u,
          result: d,
          error: l
        })
      }, m) {
      for (_.c = se({}, Fr(e), Ir(r)); ur(_.c.chunker););
      return ye(_.c.output)
    }
    try {
      _.c = se({}, Fr(e), Ir(r)), o(0)
    } catch (d) {
      return n(null, d)
    }
    function p() {
      try {
        for (var d, l = new Date().getTime(); ur(_.c.chunker);)
          if (f = Ae(_.c.chunker.inBytesProcessed) / Ae(_.c.length_0), new Date().getTime() - l > 200) return o(f), re(p, 0), 0;
        o(1), d = ye(_.c.output), re(n.bind(null, d), 0)
      } catch (w) {
        n(null, w)
      }
    }
    re(p, 0)
  }
  function Oe(e, r, n) {
    var o = {},
      _, f, u, m, p = typeof r == "undefined" && typeof n == "undefined";
    if (typeof r != "function" && (f = r, r = n = 0), n = n || function (l) {
        if (typeof f != "undefined") return Ke(u ? l : -1, f)
      }, r = r || function (l, w) {
        if (typeof f != "undefined") return postMessage({
          action: je,
          cbn: f,
          result: l,
          error: w
        })
      }, p) {
      for (o.d = te({}, e); fr(o.d.chunker););
      return Lr(ye(o.d.output))
    }
    try {
      o.d = te({}, e), m = Ae(o.d.length_0), u = m > -1, n(0)
    } catch (l) {
      return r(null, l)
    }
    function d() {
      try {
        for (var l, w = 0, S = new Date().getTime(); fr(o.d.chunker);)
          if (++w % 1e3 == 0 && new Date().getTime() - S > 200) return u && (_ = Ae(o.d.chunker.decoder.nowPos64) / m, n(_)), re(d, 0), 0;
        n(1), l = Lr(ye(o.d.output)), re(r.bind(null, l), 0)
      } catch (k) {
        r(null, k)
      }
    }
    re(d, 0)
  }
  var Ir = function () {
      var e = [{
        s: 16,
        f: 64,
        m: 0
      }, {
        s: 20,
        f: 64,
        m: 0
      }, {
        s: 19,
        f: 64,
        m: 1
      }, {
        s: 20,
        f: 64,
        m: 1
      }, {
        s: 21,
        f: 128,
        m: 1
      }, {
        s: 22,
        f: 128,
        m: 1
      }, {
        s: 23,
        f: 128,
        m: 1
      }, {
        s: 24,
        f: 255,
        m: 1
      }, {
        s: 25,
        f: 255,
        m: 1
      }];
      return function (r) {
        return e[r - 1] || e[6]
      }
    }(),
    de = function () {};
  de.compress = Ne, de.decompress = Oe, de.prototype.compress = Ne, de.prototype.decompress = Oe;
  var Xn = de;
  typeof self != "undefined" && "importScripts" in self && addEventListener("message", function (e) {
    e.data.action == ee ? Ne(e.data.data, e.data.mode, e.data.cbn) : e.data.action == je && Oe(e.data.data, e.data.cbn)
  }), Q.LZMA = de, Q.LZMA_WORKER = Xn, Q.compress = Ne, Q.decompress = Oe, Object.defineProperty(Q, "__esModule", {
    value: !0
  })
});
