class Solution:
    @staticmethod
    def longestConsecutive(nums):
        sequence_starts = []
        hashed_nums = set(nums)
        for i in hashed_nums:
            if i - 1 not in hashed_nums:
                sequence_starts.append(i)
        greatest = 0
        print(sequence_starts)
        for i in sequence_starts:
            temp = i
            count = 0
            while temp != None:

                temp = temp + 1 if temp + 1 in hashed_nums else None

                count += 1
            if count > greatest:
                greatest = count
        return greatest


nums = [9, 1, -3, 2, 4, 8, 3, -1, 6, -2, -4, 7]
print(Solution.longestConsecutive(nums))
