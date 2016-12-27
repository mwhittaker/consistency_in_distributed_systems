# Syllabus
This is the rough syllabus for a graduate led undergraduate reading group
titled "Consistency in Distributed Systems" about, well, consistency in
distributed systems. During the first half of each meeting, the group discusses
the paper we read since the previous meeting. During the second half of each
meeting, I give a brief lecture on next week's paper to make the paper a bit
easier to read and understand.

## Week 1
- Discussion: None
- Lecture: Replicated Data Consistency Explained Through Baseball

We'll begin our first class by getting to know one another a bit. Then, I'll
give an overview of the reading group and explain how the class will run. I'll
also spend a bit of time giving advice on how to read papers. Finally, I'll
give a lecture on the baseball paper.

"Replicated Data Consistency Explained Through Baseball" is a magazine article
that informally defines six consistency models and then shows how different
principals of a baseball application can use different combinations of the
six. The paper is short, very clear, and not at all intimidating. It answers
the question "What the heck are consistency models?".

## Week 2
- Discussion: Replicated Data Consistency Explained Through Baseball
- Lecture: Brewer's Conjecture and ... Web Services

We'll begin this class by discussing the baseball paper before I lecture on the
CAP theorem paper. The CAP theorem says that a partition-tolerant distributed
system cannot both be strongly consistent and available. Distributed system
designers have to choose between a weakly consistent, highly available system
and a strongly consistent, potentially unavailable system. The paper we'll read
gives a simple proof of the CAP theorem. It answers the question "Why do we
need all these different consistency models?".

## Week 3
- Discussion: Brewer's Conjecture and ... Web Services
- Lecture: Conflict-free Replicated Data Types

We'll begin this class by discussing the CAP theorem paper before I lecture on
the CRDT paper. Conflict-free (or convergent, or commutative, or confluent)
replicated data types are data structures that exploit the mathematical
properties of join semilattices to guarantee strong eventual consistency
without coordination. Despite all the jargon, they are very simple. This paper
answers the question "How do we implement weak consistency in a principled
way?".

## Week 4
- Discussion: Conflict-free Replicated Data Types
- Lecture: Chain Replication for Supporting High Throughput and Availability

We'll begin this class by discussing the CRDT paper before I lecture on the
chain replication paper. Chain replication is a practical way to implement
strong consistency. In short, nodes in a distributed system arrange themselves
into a chain. Requests are sent to the head of the chain; the request is
forwarded down the chain; and the tail responds to the request. This paper
answers the question "How to implement strong consistency in a practical way?".

## Week 5
- Discussion: Chain Replication for Supporting High Throughput and Availability
- Lecture: Coordination Avoidance in Database Systems

We'll begin this class by discussing the chain replication paper before I
lecture on the I-confluence paper. This paper answers the question "When can we
avoid coordination?". It introduces invariant-confluence (I-confluence) as a
necessary and sufficient condition for an application requiring coordination
and shows which common relation operations are I-confluent with respect to some
common invariants. Again, there's a lot of jargon, but the ideas are intuitive.

## Week 6
- Discussion: Coordination Avoidance in Database Systems
- Lecture: None

We'll begin this class by discussing the I-confluence paper. I'll also plug
some of my own research which builds off the ideas in the I-confluence paper.
We'll conclude the class with teary goodbyes.
