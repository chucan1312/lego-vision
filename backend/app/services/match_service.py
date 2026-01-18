def match_builds(inventory: dict, recipes: list, parts_map: dict, top_k: int = 10):
    results = []

    for r in recipes:
        required = r["parts"]

        missing = {}
        total_needed = 0
        total_matched = 0

        for part_id, needed in required.items():
            needed = int(needed)
            have = int(inventory.get(part_id, 0))

            total_needed += needed
            total_matched += min(have, needed)

            if have < needed:
                missing[part_id] = needed - have

        score = (total_matched / total_needed) if total_needed > 0 else 0
        completion_percent = round(score * 100, 1)

        missing_list = []
        for pid, cnt in missing.items():
            name = parts_map.get(pid, {}).get("name", f"Part {pid}")
            missing_list.append({"id": pid, "name": name, "count": cnt})

        results.append({
            "id": r["id"],
            "name": r["name"],
            "completionPercent": completion_percent,
            "missing": missing_list,
            "steps": r.get("steps", [])
        })

    results.sort(key=lambda x: x["completionPercent"], reverse=True)

    return {
        "top10": results[:top_k]
    }
