python
import struct
from typing import Dict, List

class MechatronicState:
    def __init__(self, id: int, temperature: float, velocity: float, acceleration: float):
        self.id = id
        self.temperature = temperature
        self.velocity = velocity
        self.acceleration = acceleration

class BitwiseTelemetryEncoder:
    def __init__(self):
        self.state_format = 'iiff'

    def encode(self, state: MechatronicState) -> bytes:
        return struct.pack(self.state_format, state.id, state.temperature, state.velocity, state.acceleration)

    def encode_multiple(self, states: List[MechatronicState]) -> bytes:
        buffer = bytearray()
        for state in states:
            buffer.extend(self.encode(state))
        return bytes(buffer)

    def encode_dict(self, states: Dict[int, MechatronicState]) -> bytes:
        buffer = bytearray()
        for state in states.values():
            buffer.extend(self.encode(state))
        return bytes(buffer)

    def to_hex(self, buffer: bytes) -> str:
        return buffer.hex()

def main():
    encoder = BitwiseTelemetryEncoder()
    state1 = MechatronicState(1, 20.5, 10.2, 5.1)
    state2 = MechatronicState(2, 30.8, 15.6, 7.9)
    encoded_state1 = encoder.encode(state1)
    encoded_state2 = encoder.encode(state2)
    encoded_states = encoder.encode_multiple([state1, state2])
    states_dict = {1: state1, 2: state2}
    encoded_states_dict = encoder.encode_dict(states_dict)
    print(encoder.to_hex(encoded_state1))
    print(encoder.to_hex(encoded_state2))
    print(encoder.to_hex(encoded_states))
    print(encoder.to_hex(encoded_states_dict))

if __name__ == "__main__":
    main()
