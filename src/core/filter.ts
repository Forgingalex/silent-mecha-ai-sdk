interface State {
  x: number
  v: number
}

interface Measurement {
  x: number
  v: number
}

interface Covariance {
  p11: number
  p12: number
  p21: number
  p22: number
}

interface Gain {
  k1: number
  k2: number
}

function predict(state: State, covariance: Covariance, dt: number): [State, Covariance] {
  const newState: State = {
    x: state.x + state.v * dt,
    v: state.v
  }
  const newCovariance: Covariance = {
    p11: covariance.p11 + covariance.p12 * dt + dt * dt * 0.1,
    p12: covariance.p12,
    p21: covariance.p21,
    p22: covariance.p22 + 0.1 * dt
  }
  return [newState, newCovariance]
}

function update(state: State, covariance: Covariance, measurement: Measurement): [State, Covariance, Gain] {
  const innovation = measurement.x - state.x
  const innovationCovariance = covariance.p11 + 0.1
  const gain: Gain = {
    k1: covariance.p11 / innovationCovariance,
    k2: covariance.p12 / innovationCovariance
  }
  const newState: State = {
    x: state.x + gain.k1 * innovation,
    v: state.v + gain.k2 * innovation
  }
  const newCovariance: Covariance = {
    p11: (1 - gain.k1) * covariance.p11,
    p12: (1 - gain.k1) * covariance.p12,
    p21: (1 - gain.k2) * covariance.p21,
    p22: covariance.p22 - gain.k2 * covariance.p12
  }
  return [newState, newCovariance, gain]
}

function kalmanFilter(initialState: State, initialCovariance: Covariance, measurements: Measurement[], dt: number): [State, Covariance][] {
  let state = initialState
  let covariance = initialCovariance
  const estimates: [State, Covariance][] = []
  for (const measurement of measurements) {
    [state, covariance] = predict(state, covariance, dt)
    [state, covariance] = update(state, covariance, measurement)
    estimates.push([state, covariance])
  }
  return estimates
}

const initialState: State = { x: 0, v: 0 }
const initialCovariance: Covariance = { p11: 1, p12: 0, p21: 0, p22: 1 }
const measurements: Measurement[] = [{ x: 1, v: 0 }, { x: 2, v: 0 }, { x: 3, v: 0 }]
const dt = 1
const estimates = kalmanFilter(initialState, initialCovariance, measurements, dt)
