#! /usr/bin/env Python2.6
# coding: utf-8
# by sora

if __name__ == '__main__':
    import math
    import sys

    argvs   = sys.argv
    topodir = "dat/"
    peers   = open(argvs[1]).readlines()
    geo     = open(topodir + "asngeo.txt").readlines()
    geo2    = open(topodir + "asngeo-skitter.txt").readlines()
    asdb    = open(topodir + "asinfo_20110406.list").readlines()

    asnlng   = dict()
    asname   = dict()
    ascc     = dict()
    peer     = dict()
    adjacent = dict()
    nodes    = dict()
    maxd     = 0
    allnode  = []

    for g in geo:
        asn, name, addr, lng, lat = g.rstrip("\n").split('|')
        if lng != '':
            asnlng[asn] = lng

    for g in geo2:
        asn, name, addr, lng, lat = g.rstrip("\n").split('|')
        if lng != '':
            asnlng[asn] = lng

    for g in asdb:
	asn, cc, radb, date, name = g.rstrip("\n").split('|')
	if name != '':
  	    asname[asn] = name
	if cc != '':
	    ascc[asn] = cc

    for p in peers:
        src, dst = p.rstrip("\n").split('-')
        if src != '' or dst != '':
            peer[src] = dst
        if src not in adjacent:
            adjacent[src] = []
        adjacent[src].append(dst)

    for i in adjacent.keys():
        adjacent[i] = list(set(adjacent[i]))
        if len(adjacent[i]) > maxd:
            maxd = len(adjacent[i])

    for i in adjacent.keys():
        if not i in allnode:
            allnode.append(i)
        for j in adjacent[i]:
            if not j in allnode:
                allnode.append(j)

    for a in allnode:
        if a in asnlng.keys():
            d = float(asnlng[a])
        else:
            d = 0.0
        if a in adjacent.keys():
            le = len(adjacent[a])
        else:
            le = 0

        r = float("%.3f" % (1 - math.log( ((le + 1.0) / (maxd * 1.3) * 10.0 + 1.0), 10 )))
        rr = float("%.3f" % (math.log( ((le + 1.0) / (maxd * 1.3) * 10.0 + 1.0), 10 )))
        rad = float("%.3f" % math.radians(-d))
        x = round((r * math.cos(rad)), 3)
        y = round((r * math.sin(rad)), 3)
        nodes[a] = [x, y, rr, le]

    result = []
    for i in nodes.keys():
	name  = ""
	count = 0
	if not i in asname.keys():
	    asname[i] = "unknown"
	if not i in ascc.keys():
	    ascc[i] = "XX"
	name = asname[i].split(' ')[0]
	result.append([nodes[i][3], i, nodes[i][0], nodes[i][1], nodes[i][2], name, ascc[i]])

    rank = 1
    for line in sorted(result, reverse=True):
	print rank, " ".join([str(x) for x in line])
        rank = rank + 1
