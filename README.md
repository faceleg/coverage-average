# coverage-average

Computes the average coverage from a text-summary file like:

```TEXT

=============================== Coverage summary ===============================
Statements   : 94.55% ( 52/55 )
Branches     : 100% ( 6/6 )
Functions    : 85% ( 17/20 )
Lines        : 94.44% ( 51/54 )
================================================================================
```

## Usage

Output average:

```BASH
$ coverage-average path/to/text-summary.txt
Coverage average is 93.50%
```

Output average, exit 1 if average is below threshold

```BASH
$ coverage-average path/to/text-summary.txt --limit 95
FAIL Coverage average of 93.50% is below limit of 95.00%
```

```BASH
$ coverage-average path/to/text-summary.txt --limit 90
PASS Coverage average of 93.50% is above limit of 95.00%
```
