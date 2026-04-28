interface State {
  x: number;
  v: number;
}

interface Measurement {
  x: number;
}

interface Parameters {
  q: number;
  r: number;
  dt: number;
}

class KalmanFilter {
  private state: State;
  private covariance: number[][];
  private parameters: Parameters;

  constructor(initialState: State, initialCovariance: number[][], parameters: Parameters) {
    this.state = initialState;
    this.covariance = initialCovariance;
    this.parameters = parameters;
  }

  predict() {
    const A = [
      [1, this.parameters.dt],
      [0, 1]
    ];
    const Q = [
      [this.parameters.q * this.parameters.dt ** 3 / 3, this.parameters.q * this.parameters.dt ** 2 / 2],
      [this.parameters.q * this.parameters.dt ** 2 / 2, this.parameters.q * this.parameters.dt]
    ];
    this.state = {
      x: A[0][0] * this.state.x + A[0][1] * this.state.v,
      v: A[1][0] * this.state.x + A[1][1] * this.state.v
    };
    this.covariance = addMatrices(multiplyMatrices(A, this.covariance), Q);
  }

  update(measurement: Measurement) {
    const H = [1, 0];
    const R = this.parameters.r;
    const innovation = measurement.x - (H[0] * this.state.x + H[1] * this.state.v);
    const S = H[0] * this.covariance[0][0] * H[0] + H[1] * this.covariance[1][0] * H[1] + R;
    const K = [
      this.covariance[0][0] * H[0] / S,
      this.covariance[1][0] * H[1] / S
    ];
    this.state = {
      x: this.state.x + K[0] * innovation,
      v: this.state.v + K[1] * innovation
    };
    this.covariance = subtractMatrices(this.covariance, multiplyMatrices([K], [H], this.covariance));
  }

  getState() {
    return this.state;
  }

  getCovariance() {
    return this.covariance;
  }
}

function addMatrices(a: number[][], b: number[][]): number[][] {
  return a.map((row, i) => row.map((_, j) => a[i][j] + b[i][j]));
}

function subtractMatrices(a: number[][], b: number[][]): number[][] {
  return a.map((row, i) => row.map((_, j) => a[i][j] - b[i][j]));
}

function multiplyMatrices(...matrices: number[][][]): number[][] {
  return matrices.reduce((acc, curr) => {
    const result: number[][] = [];
    for (let i = 0; i < acc.length; i++) {
      result[i] = [];
      for (let j = 0; j < curr[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < acc[0].length; k++) {
          sum += acc[i][k] * curr[k][j];
        }
        result[i][j] = sum;
      }
    }
    return result;
  });
}

function main() {
  const initialState: State = { x: 0, v: 0 };
  const initialCovariance: number[][] = [[1, 0], [0, 1]];
  const parameters: Parameters = { q: 0.1, r: 1, dt: 0.1 };
  const kalmanFilter = new KalmanFilter(initialState, initialCovariance, parameters);
  kalmanFilter.predict();
  const measurement: Measurement = { x: 1 };
  kalmanFilter.update(measurement);
  console.log(kalmanFilter.getState());
  console.log(kalmanFilter.getCovariance());
}

main();
