class Average(object):
    def __init__(self):
        self.sum = 0
        self.cnt = 0

    def query(self):
        if self.cnt != 0:
            return self.sum / self.cnt
        else:
            return 0

    def update(self, x):
        self.sum += x
        self.cnt += 1

    def merge(self, avg):
        self.sum += avg.sum
        self.cnt += avg.cnt

def main():
    x = Average();
    x.update(1)
    x.update(2)
    x.update(3)
    assert x.query() == 2

    y = Average();
    y.update(7)
    y.update(8)
    y.update(9)
    assert y.query() == 8

    x.merge(y)
    assert x.query() == 5

if __name__ == "__main__":
    main()
