interface PIDConfig {
  kp: number;
  ki: number;
  kd: number;
  min: number;
  max: number;
}

interface PIDState {
  prevError: number;
  integral: number;
}

const createPID = (config: PIDConfig) => {
  const state: PIDState = {
    prevError: 0,
    integral: 0,
  };

  return (error: number, dt: number) => {
    const { kp, ki, kd, min, max } = config;
    const { prevError, integral } = state;

    const derivative = (error - prevError) / dt;
    const newIntegral = integral + error * dt;

    let output = kp * error + ki * newIntegral + kd * derivative;

    if (output > max) {
      output = max;
      state.integral = (max - kp * error - kd * derivative) / ki;
    } else if (output < min) {
      output = min;
      state.integral = (min - kp * error - kd * derivative) / ki;
    } else {
      state.integral = newIntegral;
    }

    state.prevError = error;

    return output;
  };
};

const motorConfig: PIDConfig = {
  kp: 1.2,
  ki: 0.05,
  kd: 0.01,
  min: -10,
  max: 10,
};

const pidController = createPID(motorConfig);

const dt = 0.01;
const targetSpeed = 100;
let currentSpeed = 0;

const updateMotorSpeed = () => {
  const error = targetSpeed - currentSpeed;
  const output = pidController(error, dt);
  currentSpeed += output * dt;
};

for (let i = 0; i < 100; i++) {
  updateMotorSpeed();
  console.log(currentSpeed);
}
