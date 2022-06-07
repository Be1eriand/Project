#Defines the Base Pipe Class
from typing import Dict


class Pipe():

    def __init__(self) -> None:

        pass

    def __repr__(self) -> str:
        pass

    def process_data(self, dict) -> Dict:

        NotImplementedError()