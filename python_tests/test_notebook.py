import json
import unittest
from pathlib import Path


class NotebookTests(unittest.TestCase):
    def test_simulation_core_is_reproducible(self):
        notebook = json.loads(Path("notebooks/elo_monte_carlo.ipynb").read_text())
        namespace = {}
        imports = "".join(notebook["cells"][1]["source"]).replace(
            "import matplotlib.pyplot as plt\n", ""
        )
        exec(imports, namespace)
        exec("".join(notebook["cells"][2]["source"]), namespace)
        namespace["RUNS"] = 5
        first_ratings, first_correlation = namespace["simulate"](16, 400, 1)
        second_ratings, second_correlation = namespace["simulate"](16, 400, 1)
        self.assertEqual(first_ratings.shape, (75,))
        self.assertTrue((first_ratings == second_ratings).all())
        self.assertEqual(first_correlation, second_correlation)


if __name__ == "__main__":
    unittest.main()
