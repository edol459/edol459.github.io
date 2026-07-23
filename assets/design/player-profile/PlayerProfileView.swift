//
//  PlayerProfileView.swift
//  ydkball
//
//  Aggregated community-rating profile for a single player.
//  Pushed onto a NavigationStack (e.g. from a player tag tap, search result,
//  or the Performance card). Mirrors the structure/conventions of
//  PlayerGameCardView.swift — ScrollView + @State load + .task { await load() }.
//
//  ── STAR COLOR CONVENTION ───────────────────────────────────────────────
//  Game-review stars stay GREEN (the existing `StarDisplay`).
//  Player-PERFORMANCE rating stars are ydkball ORANGE — use `PerfStarDisplay`
//  below (a thin recolor of StarDisplay). Keep these two distinct everywhere
//  performance ratings are shown so users can tell the two systems apart.
//

import SwiftUI

// MARK: - Models (move to Models.swift when finalized)

/// Everything the player page needs for one selected season, in a single payload.
/// Suggested endpoint: GET /api/players/{personId}/profile?season={season}
struct PlayerProfileResponse: Codable {
    let player: PlayerInfo
    let seasons: [String]            // e.g. ["2024-25","2023-24",...]; "all" handled client-side
    let averages: SeasonAverages
    let ratingSummary: RatingSummary
    let trend: [TrendPoint]          // last 10–15, chronological
    let bestPerformance: PerformanceItem?
    let recentPerformances: [PerformanceItem]
    let recentReviews: [PerformanceReview]   // reuse existing model
    let followerCount: Int
    let isFollowing: Bool

    enum CodingKeys: String, CodingKey {
        case player, seasons, averages, trend
        case ratingSummary       = "rating_summary"
        case bestPerformance     = "best_performance"
        case recentPerformances  = "recent_performances"
        case recentReviews       = "recent_reviews"
        case followerCount       = "follower_count"
        case isFollowing         = "is_following"
    }
}

struct PlayerInfo: Codable {
    let personId: Int
    let name: String
    let teamAbbr: String
    let teamName: String
    let position: String?
    let jersey: String?
    let leagueRaw: String?

    enum CodingKeys: String, CodingKey {
        case personId  = "person_id"
        case name
        case teamAbbr  = "team_abbr"
        case teamName  = "team_name"
        case position
        case jersey
        case leagueRaw = "league"
    }

    var league: League { League(rawValue: leagueRaw ?? "nba") ?? .nba }

    /// NBA: cdn.nba.com 1040x760 · WNBA: ak-static (matches Performer/PlayerGameCardView).
    var headshotURL: URL? {
        if league == .wnba {
            return URL(string: "https://ak-static.cms.nba.com/wp-content/uploads/headshots/wnba/latest/260x190/\(personId).png")
        }
        return URL(string: "https://cdn.nba.com/headshots/nba/latest/1040x760/\(personId).png")
    }
}

/// Official NBA season averages (from the app's existing gamelog data).
struct SeasonAverages: Codable {
    let gp: Int
    let ppg, rpg, apg, mpg: Double
    let fgPct, tpPct, ftPct: Double   // already as percentages, e.g. 47.3

    enum CodingKeys: String, CodingKey {
        case gp, ppg, rpg, apg, mpg
        case fgPct = "fg_pct"
        case tpPct = "tp_pct"
        case ftPct = "ft_pct"
    }
}

/// Community rating roll-up for the selected season (+ career figure).
struct RatingSummary: Codable {
    let seasonAvgStars: Double?
    let careerAvgStars: Double?
    let totalRated: Int
    let highest: PerformanceItem?
    let lowest: PerformanceItem?

    enum CodingKeys: String, CodingKey {
        case seasonAvgStars = "season_avg_stars"
        case careerAvgStars = "career_avg_stars"
        case totalRated     = "total_rated"
        case highest, lowest
    }
}

struct TrendPoint: Codable, Identifiable {
    let gameId: String
    let opponentAbbr: String
    let stars: Double
    var id: String { gameId }

    enum CodingKeys: String, CodingKey {
        case gameId       = "game_id"
        case opponentAbbr = "opponent_abbr"
        case stars
    }
}

/// One game performance with its community rating. Drives the recent list,
/// best card, and best/worst summary entries. Bridges to PlayerGameCardView.
struct PerformanceItem: Codable, Identifiable {
    let gameId: String
    let personId: Int
    let opponentAbbr: String
    let isHome: Bool
    let gameDate: String          // ISO or "yyyy-MM-dd"
    let won: Bool
    let teamScore: Int?
    let opponentScore: Int?
    let avgStars: Double?
    let reviewCount: Int
    let isPlayoffs: Bool
    let topReviewText: String?
    let topReviewUser: String?
    let leagueRaw: String?

    var id: String { "\(gameId)-\(personId)" }

    enum CodingKeys: String, CodingKey {
        case gameId        = "game_id"
        case personId      = "person_id"
        case opponentAbbr  = "opponent_abbr"
        case isHome        = "is_home"
        case gameDate      = "game_date"
        case won
        case teamScore     = "team_score"
        case opponentScore = "opponent_score"
        case avgStars      = "avg_stars"
        case reviewCount   = "review_count"
        case isPlayoffs    = "is_playoffs"
        case topReviewText = "top_review_text"
        case topReviewUser = "top_review_user"
        case leagueRaw     = "league"
    }

    var league: League { League(rawValue: leagueRaw ?? "nba") ?? .nba }
    var matchupPrefix: String { isHome ? "vs \(opponentAbbr)" : "@ \(opponentAbbr)" }
    var resultLine: String {
        guard let t = teamScore, let o = opponentScore else { return won ? "W" : "L" }
        return "\(won ? "W" : "L") \(t)\u{2013}\(o)"
    }
    var shortDate: String {
        let iso = ISO8601DateFormatter()
        let ymd = DateFormatter(); ymd.dateFormat = "yyyy-MM-dd"
        let date = iso.date(from: gameDate) ?? ymd.date(from: gameDate)
        guard let date else { return gameDate }
        let out = DateFormatter(); out.dateFormat = "MMM d"
        return out.string(from: date)
    }

    /// Reuse the existing performance-card identifier so tapping a row pushes
    /// straight into PlayerGameCardView (single-game stats + reviews + rate sheet).
    var cardIdentifier: PlayerCardIdentifier {
        PlayerCardIdentifier(gameId: gameId, personId: personId, playerName: "",
                             matchup: matchupPrefix, isLive: false, league: league)
    }
}

// MARK: - Orange performance star display (parallel to green StarDisplay)

struct PerfStarDisplay: View {
    let stars: Double          // 0.5 – 5.0
    var size: CGFloat = 14

    var body: some View {
        HStack(spacing: 1) {
            ForEach(1...5, id: \.self) { i in
                let full = stars >= Double(i)
                let half = !full && stars >= Double(i) - 0.5
                Image(systemName: full ? "star.fill" : half ? "star.leadinghalf.filled" : "star")
                    .font(.system(size: size))
                    .foregroundStyle(full || half ? Color.ydkOrange : Color(.systemGray4))
            }
        }
    }
}

// MARK: - Player Profile View

struct PlayerProfileView: View {
    let personId: Int
    let league: League

    @EnvironmentObject var auth: AuthManager

    // Seeded with sample data so the screen renders ALL sections immediately,
    // with zero backend dependency. Swap in the real fetch in `load()` once the
    // /api/players/{id}/profile endpoint exists (see API additions at bottom).
    @State private var data: PlayerProfileResponse? = .sample
    @State private var season: String = "2024-25"    // most recent by default; "all" = All-Time
    @State private var isLoading = false
    @State private var isFollowing = false
    @State private var followerCount = 3402
    @State private var followLoading = false
    @State private var showRateSheet = false

    var body: some View {
        ScrollView {
            if isLoading && data == nil {
                ShrugLoader(size: 100)
                    .frame(maxWidth: .infinity).padding(.top, 80)
            } else if let d = data {
                VStack(spacing: 0) {
                    header(d)
                    seasonMenu(d)
                    averagesCard(d.averages)
                    ratingSummaryCard(d.ratingSummary)
                    trendCard(d.trend)
                    if let best = d.bestPerformance { bestCard(best) }
                    recentList(d.recentPerformances)
                    reviewsList(d.recentReviews)
                }
                .padding(.bottom, 90)
            } else {
                ContentUnavailableView("Profile unavailable",
                                       systemImage: "person.crop.circle.badge.exclamationmark")
                    .padding(.top, 100)
            }
        }
        .safeAreaInset(edge: .bottom) { rateCTA }          // sticky "Rate his last game"
        .navigationTitle(data?.player.name ?? "Player")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button { /* share player profile */ } label: {
                    Image(systemName: "square.and.arrow.up")
                }
            }
        }
        .task { await load() }
        .sheet(isPresented: $showRateSheet) {
            if let mostRecent = data?.recentPerformances.first {
                RatePerformanceSheet(
                    playerName: data?.player.name ?? "",
                    matchup: mostRecent.matchupPrefix,
                    initialRating: 0,
                    initialText: "",
                    onSubmit: { rating, text in
                        Task {
                            try? await API.shared.submitPerformanceReview(
                                gameId: mostRecent.gameId, personId: personId,
                                rating: rating, text: text,
                                playerName: data?.player.name)
                            await load()
                        }
                    },
                    onDelete: nil
                )
                .presentationDetents([.medium])
                .presentationDragIndicator(.visible)
            }
        }
    }

    // MARK: Header

    @ViewBuilder
    private func header(_ d: PlayerProfileResponse) -> some View {
        VStack(spacing: 14) {
            ZStack(alignment: .bottomTrailing) {
                CachedHeadshotView(url: d.player.headshotURL, width: 96, height: 96)
                    .clipShape(Circle())
                    .overlay(Circle().stroke(Color(.systemGray3), lineWidth: 1.5))
                TeamBadge(abbr: d.player.teamAbbr, size: 30, league: d.player.league)
                    .background(Circle().fill(Color(.systemBackground)).frame(width: 36, height: 36))
                    .offset(x: 4, y: 4)
            }

            Text(d.player.name)
                .font(.custom("DMSerifDisplay-Regular", size: 30))
                .multilineTextAlignment(.center)

            HStack(spacing: 7) {
                Text(d.player.league.displayName)
                    .font(.system(size: 9, weight: .bold, design: .monospaced))
                    .foregroundStyle(.white)
                    .padding(.horizontal, 7).padding(.vertical, 2)
                    .background(Capsule().fill(Color.ydkOrange))
                Text([d.player.teamName, d.player.position, d.player.jersey.map { "#\($0)" }]
                        .compactMap { $0 }.joined(separator: " \u{00b7} "))
                    .font(.system(size: 11, design: .monospaced))
                    .foregroundStyle(.secondary)
            }

            // Follow + notify
            HStack(spacing: 10) {
                Button(action: { Task { await toggleFollow() } }) {
                    Group {
                        if followLoading {
                            ProgressView().tint(isFollowing ? .primary : .white)
                        } else {
                            Label(isFollowing ? "Following" : "Follow",
                                  systemImage: isFollowing ? "checkmark" : "plus")
                                .font(.system(size: 15, weight: .semibold))
                        }
                    }
                    .frame(maxWidth: .infinity).padding(.vertical, 12)
                    .background(isFollowing ? Color(.secondarySystemBackground) : Color.ydkOrange)
                    .foregroundStyle(isFollowing ? Color.primary : Color.white)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                }
                .disabled(followLoading)

                Button { /* toggle game-day notifications */ } label: {
                    Image(systemName: "bell")
                        .font(.system(size: 18))
                        .frame(width: 48, height: 46)
                        .background(Color(.secondarySystemBackground))
                        .foregroundStyle(.primary)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }
            }

            Text("\(followerCount.formatted()) followers")
                .font(.system(size: 10, design: .monospaced))
                .foregroundStyle(.tertiary)
        }
        .padding(.horizontal, 20).padding(.top, 16).padding(.bottom, 8)
    }

    // MARK: Season selector (native Menu / dropdown)

    @ViewBuilder
    private func seasonMenu(_ d: PlayerProfileResponse) -> some View {
        let options = d.seasons + ["all"]
        Menu {
            ForEach(options, id: \.self) { s in
                Button {
                    season = s
                    Task { await load() }
                } label: {
                    if season == s { Label(seasonLabel(s), systemImage: "checkmark") }
                    else { Text(seasonLabel(s)) }
                }
            }
        } label: {
            HStack {
                Text("SEASON")
                    .font(.system(size: 10, weight: .medium, design: .monospaced))
                    .foregroundStyle(.secondary)
                Spacer()
                Text(seasonLabel(season))
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundStyle(.primary)
                Image(systemName: "chevron.up.chevron.down")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(.ydkOrange)
            }
            .padding(.horizontal, 16).padding(.vertical, 13)
            .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 12))
        }
        .padding(.horizontal, 20).padding(.vertical, 8)
    }

    private func seasonLabel(_ s: String) -> String { s == "all" ? "All-Time" : s }

    // MARK: Season averages (big-3 + secondary row)

    private func averagesCard(_ a: SeasonAverages) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            sectionLabel("Season Averages", trailing: "\(a.gp) GP")
            VStack(spacing: 0) {
                HStack(spacing: 0) {
                    bigStat(String(format: "%.1f", a.ppg), "PPG")
                    cellDivider(72)
                    bigStat(String(format: "%.1f", a.rpg), "RPG")
                    cellDivider(72)
                    bigStat(String(format: "%.1f", a.apg), "APG")
                }
                Divider()
                HStack(spacing: 0) {
                    smallStat(String(format: "%.1f%%", a.fgPct), "FG%")
                    cellDivider(34)
                    smallStat(String(format: "%.1f%%", a.tpPct), "3P%")
                    cellDivider(34)
                    smallStat(String(format: "%.1f%%", a.ftPct), "FT%")
                    cellDivider(34)
                    smallStat(String(format: "%.1f", a.mpg), "MPG")
                }
            }
            .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 14))
        }
        .padding(.horizontal, 20).padding(.bottom, 8)
    }

    // MARK: Community rating summary

    private func ratingSummaryCard(_ r: RatingSummary) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            sectionLabel("Community Rating")
            VStack(spacing: 0) {
                HStack(alignment: .center, spacing: 16) {
                    Text(String(format: "%.1f", r.seasonAvgStars ?? 0))
                        .font(.custom("DMSerifDisplay-Regular", size: 50))
                    VStack(alignment: .leading, spacing: 6) {
                        PerfStarDisplay(stars: r.seasonAvgStars ?? 0, size: 16)
                        Text("\(season == "all" ? "Career Avg" : "Season Avg") \u{00b7} \(r.totalRated.formatted()) ratings")
                            .font(.system(size: 10, design: .monospaced))
                            .foregroundStyle(.secondary)
                    }
                    Spacer()
                }
                .padding(16)
                Divider()
                HStack(spacing: 0) {
                    summaryTile("Career Avg", value: String(format: "%.1f", r.careerAvgStars ?? 0), star: true)
                    cellDivider(54)
                    summaryTile("Rated", value: r.totalRated.formatted(), star: false)
                }
                Divider()
                HStack(spacing: 0) {
                    summaryTile("Highest",
                                value: r.highest.map { String(format: "%.1f", $0.avgStars ?? 0) } ?? "\u{2013}",
                                star: true, sub: r.highest?.let { "\($0.matchupPrefix) \u{00b7} \($0.shortDate)" })
                    cellDivider(54)
                    summaryTile("Lowest",
                                value: r.lowest.map { String(format: "%.1f", $0.avgStars ?? 0) } ?? "\u{2013}",
                                star: true, sub: r.lowest?.let { "\($0.matchupPrefix) \u{00b7} \($0.shortDate)" })
                }
            }
            .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 14))
        }
        .padding(.horizontal, 20).padding(.bottom, 8)
    }

    // MARK: Rating trend (simple bar chart)

    private func trendCard(_ trend: [TrendPoint]) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            sectionLabel("Rating Trend", trailing: "Last \(trend.count) \u{00b7} 0\u{2013}5")
            VStack(spacing: 8) {
                HStack(alignment: .bottom, spacing: 5) {
                    ForEach(trend) { p in
                        VStack(spacing: 4) {
                            Text(String(format: "%.1f", p.stars))
                                .font(.system(size: 8, design: .monospaced))
                                .foregroundStyle(.secondary)
                            RoundedRectangle(cornerRadius: 3)
                                .fill(trendColor(p.stars))
                                .frame(width: 16, height: max(4, CGFloat(p.stars / 5) * 74))
                            Text(p.opponentAbbr)
                                .font(.system(size: 8, design: .monospaced))
                                .foregroundStyle(.tertiary)
                        }
                        .frame(maxWidth: .infinity)
                    }
                }
            }
            .padding(16)
            .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 14))
        }
        .padding(.horizontal, 20).padding(.bottom, 8)
    }

    /// hot = orange, cold = red, middle = neutral.
    private func trendColor(_ s: Double) -> Color {
        if s >= 4 { return .ydkOrange }
        if s <= 2.5 { return .red }
        return Color(.systemGray3)
    }

    // MARK: Best-rated performance

    private func bestCard(_ p: PerformanceItem) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            sectionLabel("Best-Rated Performance")
            NavigationLink(value: p.cardIdentifier) {
                VStack(spacing: 0) {
                    HStack(spacing: 16) {
                        VStack(spacing: 5) {
                            Text(String(format: "%.1f", p.avgStars ?? 0))
                                .font(.custom("DMSerifDisplay-Regular", size: 40))
                                .foregroundStyle(.ydkOrange)
                            PerfStarDisplay(stars: p.avgStars ?? 0, size: 12)
                        }
                        Divider().frame(height: 56)
                        VStack(alignment: .leading, spacing: 4) {
                            HStack(spacing: 7) {
                                TeamBadge(abbr: p.opponentAbbr, size: 20, league: p.league)
                                Text("\(p.matchupPrefix) \u{00b7} \(p.shortDate)")
                                    .font(.system(size: 12, design: .monospaced))
                                    .foregroundStyle(.primary)
                            }
                            Text("\(p.resultLine) \u{00b7} \(p.reviewCount) ratings")
                                .font(.system(size: 10, design: .monospaced))
                                .foregroundStyle(.secondary)
                            if p.isPlayoffs {
                                Text("PLAYOFFS")
                                    .font(.system(size: 8, weight: .semibold, design: .monospaced))
                                    .foregroundStyle(.ydkOrange)
                                    .padding(.horizontal, 7).padding(.vertical, 2)
                                    .overlay(Capsule().stroke(Color.ydkOrange, lineWidth: 1))
                            }
                        }
                        Spacer(minLength: 0)
                    }
                    .padding(16)
                    if let quote = p.topReviewText {
                        Divider()
                        VStack(alignment: .leading, spacing: 8) {
                            Text("\u{201C}\(quote)\u{201D}")
                                .font(.system(size: 14))
                                .foregroundStyle(.primary)
                                .fixedSize(horizontal: false, vertical: true)
                            if let u = p.topReviewUser {
                                Text(u).font(.system(size: 10, design: .monospaced)).foregroundStyle(.secondary)
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(16)
                    }
                }
                .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 14))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color.ydkOrange.opacity(0.4), lineWidth: 1))
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 20).padding(.bottom, 8)
    }

    // MARK: Recent performances

    private func recentList(_ items: [PerformanceItem]) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            sectionLabel("Recent Performances")
            VStack(spacing: 0) {
                ForEach(Array(items.enumerated()), id: \.element.id) { i, p in
                    NavigationLink(value: p.cardIdentifier) {
                        HStack(spacing: 12) {
                            TeamBadge(abbr: p.opponentAbbr, size: 26, league: p.league)
                            VStack(alignment: .leading, spacing: 2) {
                                Text(p.matchupPrefix)
                                    .font(.system(size: 12, design: .monospaced))
                                    .foregroundStyle(.primary)
                                Text("\(p.shortDate) \u{00b7} \(p.resultLine)")
                                    .font(.system(size: 9, design: .monospaced))
                                    .foregroundStyle(p.won ? .secondary : .tertiary)
                            }
                            Spacer()
                            VStack(alignment: .trailing, spacing: 3) {
                                PerfStarDisplay(stars: p.avgStars ?? 0, size: 12)
                                Text("\(String(format: "%.1f", p.avgStars ?? 0)) \u{00b7} \(p.reviewCount)")
                                    .font(.system(size: 9, design: .monospaced))
                                    .foregroundStyle(.secondary)
                            }
                            Image(systemName: "chevron.right")
                                .font(.system(size: 11, weight: .semibold))
                                .foregroundStyle(.tertiary)
                        }
                        .padding(.horizontal, 16).padding(.vertical, 13)
                    }
                    .buttonStyle(.plain)
                    if i < items.count - 1 { Divider().padding(.leading, 54) }
                }
            }
            .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 14))
        }
        .padding(.horizontal, 20).padding(.bottom, 8)
    }

    // MARK: Community reviews stream

    private func reviewsList(_ reviews: [PerformanceReview]) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            sectionLabel("Community Reviews")
            if reviews.isEmpty {
                Text("No reviews yet. Be the first to rate a performance!")
                    .font(.system(size: 13, design: .monospaced))
                    .foregroundStyle(.secondary)
            } else {
                VStack(spacing: 0) {
                    ForEach(Array(reviews.enumerated()), id: \.element.id) { i, rv in
                        // PerformanceReviewRow already exists in PlayerGameCardView.swift —
                        // but it uses the green StarDisplay. For the performance feel,
                        // either swap that row's StarDisplay→PerfStarDisplay, or use this inline:
                        VStack(alignment: .leading, spacing: 6) {
                            HStack(spacing: 8) {
                                AvatarView(url: rv.avatarUrl, name: rv.displayName, size: 28)
                                VStack(alignment: .leading, spacing: 1) {
                                    Text(rv.displayName).font(.system(size: 13, weight: .semibold))
                                    Text(rv.relativeDate).font(.system(size: 10, design: .monospaced))
                                        .foregroundStyle(.secondary)
                                }
                                Spacer()
                                PerfStarDisplay(stars: rv.stars, size: 11)
                                Text(String(format: "%.1f", rv.stars))
                                    .font(.system(size: 11, weight: .semibold, design: .monospaced))
                                    .foregroundStyle(.ydkOrange)
                            }
                            if let text = rv.reviewText, !text.isEmpty {
                                Text(text).font(.system(size: 13))
                                    .fixedSize(horizontal: false, vertical: true)
                            }
                        }
                        .padding(16)
                        if i < reviews.count - 1 { Divider().padding(.leading, 16) }
                    }
                }
                .background(Color(.secondarySystemBackground), in: RoundedRectangle(cornerRadius: 14))
            }
        }
        .padding(.horizontal, 20).padding(.bottom, 8)
    }

    // MARK: Sticky CTA

    private var rateCTA: some View {
        VStack(spacing: 0) {
            Divider()
            Button { showRateSheet = true } label: {
                VStack(spacing: 2) {
                    Text("Rate \(firstName)'s Last Game")
                        .font(.system(size: 15, weight: .semibold))
                    if let g = data?.recentPerformances.first {
                        Text("\(g.matchupPrefix) \u{00b7} \(g.shortDate) \u{00b7} \(g.resultLine)")
                            .font(.system(size: 9, design: .monospaced)).opacity(0.85)
                    }
                }
                .frame(maxWidth: .infinity).padding(.vertical, 12)
                .background(Color.ydkOrange).foregroundStyle(.white)
                .clipShape(RoundedRectangle(cornerRadius: 12))
            }
            .padding(.horizontal, 20).padding(.vertical, 10)
        }
        .background(.bar)
    }

    private var firstName: String {
        (data?.player.name).flatMap { $0.split(separator: " ").first.map(String.init) } ?? "him"
    }

    // MARK: - Reusable bits

    private func sectionLabel(_ title: String, trailing: String? = nil) -> some View {
        HStack {
            Text(title.uppercased())
                .font(.system(size: 10, weight: .medium, design: .monospaced))
                .foregroundStyle(.secondary).kerning(0.8)
            Spacer()
            if let trailing {
                Text(trailing).font(.system(size: 10, design: .monospaced)).foregroundStyle(.tertiary)
            }
        }
    }

    private func bigStat(_ value: String, _ label: String) -> some View {
        VStack(spacing: 6) {
            Text(value).font(.custom("DMSerifDisplay-Regular", size: 34))
            Text(label).font(.system(size: 10, weight: .medium, design: .monospaced))
                .foregroundStyle(.secondary).kerning(1)
        }
        .frame(maxWidth: .infinity).padding(.vertical, 16)
    }

    private func smallStat(_ value: String, _ label: String) -> some View {
        VStack(spacing: 4) {
            Text(value).font(.system(size: 15, weight: .semibold, design: .monospaced))
            Text(label).font(.system(size: 9, design: .monospaced))
                .foregroundStyle(.secondary).kerning(0.5)
        }
        .frame(maxWidth: .infinity).padding(.vertical, 13)
    }

    @ViewBuilder
    private func summaryTile(_ label: String, value: String, star: Bool, sub: String? = nil) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label.uppercased())
                .font(.system(size: 9, design: .monospaced)).foregroundStyle(.tertiary).kerning(0.4)
            HStack(spacing: 3) {
                Text(value).font(.system(size: 16, weight: .semibold, design: .monospaced))
                if star { Image(systemName: "star.fill").font(.system(size: 11)).foregroundStyle(.ydkOrange) }
            }
            if let sub {
                Text(sub).font(.system(size: 10, design: .monospaced)).foregroundStyle(.secondary)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading).padding(14)
    }

    private func cellDivider(_ h: CGFloat) -> some View {
        Rectangle().fill(Color(.separator)).frame(width: 0.5, height: h)
    }

    // MARK: - Data

    private func load() async {
        // The view already shows PlayerProfileResponse.sample, so every section
        // renders out of the box. Once the backend endpoint exists, uncomment:
        //
        //   if data == nil { isLoading = true }
        //   defer { isLoading = false }
        //   do {
        //       let resp = try await API.shared.playerProfile(
        //           personId: personId, league: league,
        //           season: season.isEmpty ? nil : season)
        //       data = resp
        //       isFollowing = resp.isFollowing
        //       followerCount = resp.followerCount
        //   } catch {
        //       print("PlayerProfile load failed:", error)   // keeps sample on failure
        //   }
    }

    private func toggleFollow() async {
        guard auth.user != nil else { return }   // gate behind sign-in like the friend flow
        let wasFollowing = isFollowing
        isFollowing.toggle()                      // optimistic
        followerCount += isFollowing ? 1 : -1
        followLoading = true
        defer { followLoading = false }
        // Wire up once the endpoint exists:
        //   do { try await API.shared.setPlayerFollow(personId: personId, follow: isFollowing) }
        //   catch { isFollowing = wasFollowing; followerCount += isFollowing ? 1 : -1 }
        _ = wasFollowing
    }
}

// Tiny optional-map sugar used above for best/worst sublabels.
private extension Optional {
    func `let`<T>(_ transform: (Wrapped) -> T) -> T? { map(transform) }
}

// MARK: - API additions
//
// Add these to API.swift (they need the private `fetch` helper). Endpoints are
// suggestions — wire them to whatever the backend exposes for player aggregates.
//
//   extension API {
//       func playerProfile(personId: Int, league: League = .nba,
//                          season: String? = nil) async throws -> PlayerProfileResponse {
//           var params = ["league": league.rawValue]
//           if let season { params["season"] = season }
//           return try await fetch("/api/players/\(personId)/profile", params: params)
//       }
//
//       func playerPerformances(personId: Int, season: String? = nil,
//                              offset: Int = 0) async throws -> ([PerformanceItem], Bool) {
//           struct R: Codable { let performances: [PerformanceItem]; let hasMore: Bool
//               enum CodingKeys: String, CodingKey { case performances; case hasMore = "has_more" } }
//           var params = ["offset": "\(offset)", "limit": "20"]
//           if let season { params["season"] = season }
//           let r: R = try await fetch("/api/players/\(personId)/performances", params: params)
//           return (r.performances, r.hasMore)
//       }
//
//       @discardableResult
//       func setPlayerFollow(personId: Int, follow: Bool) async throws -> Bool {
//           let _: OK = try await fetch("/api/players/\(personId)/follow",
//                                       method: follow ? "POST" : "DELETE")
//           return follow
//       }
//   }

// MARK: - Sample data (Tyrese Haliburton)
//
// Remove once real endpoints are wired. Lets the screen render every section
// immediately in previews and in the app before the backend is ready.

private func perfItem(_ opp: String, home: Bool, _ date: String, won: Bool,
                      _ ts: Int, _ os: Int, _ stars: Double, _ raters: Int,
                      playoffs: Bool = false, quote: String? = nil, user: String? = nil) -> PerformanceItem {
    PerformanceItem(gameId: "sample_\(opp)_\(date)",
                    personId: 1630169, opponentAbbr: opp, isHome: home, gameDate: date,
                    won: won, teamScore: ts, opponentScore: os, avgStars: stars,
                    reviewCount: raters, isPlayoffs: playoffs,
                    topReviewText: quote, topReviewUser: user, leagueRaw: "nba")
}

extension PerformanceReview {
    static func sample(_ id: Int, _ user: String, _ stars: Double, _ text: String, _ created: String) -> PerformanceReview {
        PerformanceReview(id: id, gameId: "0042400301", personId: 1630169, userId: id,
                          displayName: user, avatarUrl: nil,
                          rating: Int(stars * 2), stars: stars,
                          reviewText: text, createdAt: created)
    }
}

extension PlayerProfileResponse {
    static let sample: PlayerProfileResponse = {
        let best = perfItem("NYK", home: true, "2025-05-06", won: true, 130, 121, 5.0, 318,
                            playoffs: true,
                            quote: "The jumper is back and the Pacers look like a different team when he\u2019s locked in.",
                            user: "@ethan")
        let worst = perfItem("MIL", home: true, "2025-02-14", won: false, 104, 115, 1.5, 211)

        let recent: [PerformanceItem] = [
            perfItem("CLE", home: false, "2025-05-11", won: true, 114, 105, 4.5, 286),
            perfItem("MIL", home: true,  "2025-05-08", won: true, 119, 112, 3.0, 142),
            best,
            perfItem("MEM", home: false, "2025-05-02", won: true, 121, 110, 4.5, 156),
            perfItem("DET", home: true,  "2025-04-28", won: true, 112, 99,  4.0, 110),
            perfItem("ATL", home: false, "2025-04-25", won: true, 116, 103, 3.5, 121),
            perfItem("BOS", home: true,  "2025-04-22", won: false,101, 123, 2.5, 198),
            perfItem("MIA", home: false, "2025-04-18", won: true, 109, 104, 4.0, 134),
            perfItem("CHI", home: true,  "2025-04-15", won: true, 124, 108, 3.0, 96),
            worst,
        ]

        let trend: [TrendPoint] = [
            ("ORL", 4.5), ("CHI", 3.0), ("MIA", 4.0), ("NYK", 5.0), ("BOS", 2.5),
            ("ATL", 3.5), ("DET", 4.0), ("MEM", 4.5), ("MIL", 3.0), ("CLE", 4.5),
        ].enumerated().map { i, t in TrendPoint(gameId: "trend\(i)", opponentAbbr: t.0, stars: t.1) }

        let reviews: [PerformanceReview] = [
            .sample(1, "@ethan", 5.0, "The jumper is back and the Pacers look like a different team when he\u2019s locked in.", "2025-05-06T22:14:00Z"),
            .sample(2, "@hoopsdad", 4.5, "Quietly ran the whole thing. 14 dimes, zero panic in crunch time \u2014 the All-NBA version.", "2025-05-11T20:02:00Z"),
            .sample(3, "@ballknower", 2.5, "Got hunted on every switch. Boston clearly had a scouting plan for him and it worked.", "2025-04-22T23:40:00Z"),
            .sample(4, "@heatcheck", 4.0, "Controlled tempo all night and iced it from the line. Vintage Hali closing a road game.", "2025-04-18T21:30:00Z"),
            .sample(5, "@reggie.m", 1.5, "Six turnovers and no rhythm. One of those nights you just flush and move on.", "2025-02-14T22:55:00Z"),
        ]

        return PlayerProfileResponse(
            player: PlayerInfo(personId: 1630169, name: "Tyrese Haliburton",
                               teamAbbr: "IND", teamName: "Indiana Pacers",
                               position: "PG", jersey: "0", leagueRaw: "nba"),
            seasons: ["2024-25", "2023-24", "2022-23", "2021-22", "2020-21"],
            averages: SeasonAverages(gp: 73, ppg: 18.6, rpg: 3.5, apg: 9.2, mpg: 33.6,
                                     fgPct: 47.3, tpPct: 38.4, ftPct: 85.1),
            ratingSummary: RatingSummary(seasonAvgStars: 3.8, careerAvgStars: 3.6,
                                         totalRated: 1247, highest: best, lowest: worst),
            trend: trend,
            bestPerformance: best,
            recentPerformances: recent,
            recentReviews: reviews,
            followerCount: 3402,
            isFollowing: false
        )
    }()
}

#Preview {
    NavigationStack {
        PlayerProfileView(personId: 1630169, league: .nba)
            .environmentObject(AuthManager())
    }
    .preferredColorScheme(.dark)
}
