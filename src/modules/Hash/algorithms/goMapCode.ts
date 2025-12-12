import type { SupportedLanguage } from "../../../types";

export const GO_MAP_CODE: Partial<Record<SupportedLanguage, string>> = {
  go: `// Go Map Implementation (Simplified)

const bucketSize = 8

type hmap struct {
    count     int
    B         uint8  // log_2 of # of buckets
    buckets   unsafe.Pointer
    oldbuckets unsafe.Pointer
}

type bmap struct {
    tophash [bucketSize]uint8
    keys    [bucketSize]keyType
    values  [bucketSize]elemType
    overflow *bmap
}

func (h *hmap) mapassign(key K) V {
    if h.buckets == nil {
        h.buckets = newBucketArray(h.B) // @label:init_buckets
    }

    hash := hash(key)
    bucketIndex := hash & (1<<h.B - 1) // @label:calc_hash
    b := h.buckets[bucketIndex]
    top := tophash(hash)

    // Search for existing key
    for ; b != nil; b = b.overflow { // @label:search_bucket
        for i := 0; i < bucketSize; i++ {
            if b.tophash[i] != top { continue } // @label:check_tophash
            if b.keys[i] == key { // @label:check_key
                return &b.values[i] // Found, update value
            }
        }
    }

    // Key not found, insert
    b = h.buckets[bucketIndex]
    for ; b != nil; b = b.overflow { // @label:find_empty
        for i := 0; i < bucketSize; i++ {
            if b.keys[i] == nil { // @label:insert_slot
                b.tophash[i] = top
                b.keys[i] = key
                h.count++
                return &b.values[i]
            }
        }
    }

    // No empty slot, create overflow
    newB := new(bmap) // @label:new_overflow
    linkOverflow(h.buckets[bucketIndex], newB)
    // ... insert into newB ...
}
`
};
