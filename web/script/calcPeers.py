#! /usr/bin/env Python2.6
# coding: utf-8
# by sora

if __name__ == '__main__':
    import math
    import sys

    argvs   = sys.argv
    topodir = "dat/"
    peers   = open(argvs[1]).readlines()
    geo     = open(topodir + "aslatlong-20070110.txt").readlines()

    asnlng   = dict()
    adjacent = dict()
    nodes    = dict()
    maxd     = 0
    allnode  = []

    for g in geo:
        asn, name, cc, conti, irr, date, lat, lng = g.rstrip("\n").split('|')
        if lng != '':
            asnlng[asn] = lng

    for p in peers:
        src, _, dst, _ = p.rstrip("\n").split('|')
#        if src != '' or dst != '':
#            peer[src] = dst
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
            d = 180.0
        if a in adjacent.keys():
            le = len(adjacent[a])
        else:
            le = 0.0

        r = float("%.3f" % (1 - math.log( ((le + 1.0) / (maxd * 1.3) * 10.0 + 1.0), 10 )))
        rr = float("%.3f" % (math.log( ((le + 1.0) / (maxd * 1.3) * 10.0 + 1.0), 10 )))
        rad = float("%.3f" % math.radians(-d))
        x = round((r * math.cos(rad)), 3)
        y = round((r * math.sin(rad)), 3)
        nodes[a] = (x, y, rr, d)

#    for i in sorted(nodes.keys()):
#        print i, nodes[i][0], nodes[i][1], nodes[i][2]

    for i in adjacent.keys():
        if not i in asnlng.keys():
            asnlng[i] = 0
        for j in adjacent[i]:
	    if nodes[i][3] == 180.0 or nodes[j][3] == 180.0:
	        continue
            print i, nodes[i][0], nodes[i][1], nodes[i][2], nodes[j][0], nodes[j][1], nodes[j][2], asnlng[i] 
